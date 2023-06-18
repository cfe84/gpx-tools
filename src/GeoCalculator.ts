import { Duration } from "luxon";
import { Point } from "./Point";
import { Line } from "./Line";

export class GeoCalculator {
  static calculateTotalDistanceInMeters(points: Point[]): number {
    let firstPoint = points[0];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += this.calculateDistanceBetweenPointsInMeters(firstPoint, points[i]);
      firstPoint = points[i];
    }
    return total;
  }

  private static calculateDistanceBetweenPointsPos(wpt1: Point, wpt2: Point): number {
    const earthRadiusKm = 6371000;

    const dLat = this.toRadian(wpt2.latitude - wpt1.latitude);
    const dLon = this.toRadian(wpt2.longitude - wpt1.longitude);

    const lat1 = this.toRadian(wpt1.latitude);
    const lat2 = this.toRadian(wpt2.latitude);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  static calculateDistanceBetweenPointsInMeters(
    wpt1: Point,
    wpt2: Point
  ): number {
    const latLongDist = this.calculateDistanceBetweenPointsPos(wpt1, wpt2);
    const eleDiff = (wpt2.elevation - wpt1.elevation) / 1000;
    return Math.sqrt(Math.pow(eleDiff, 2) + Math.pow(latLongDist, 2));
  }

  private static toRadian(degree: number): number {
    return degree * Math.PI / 180;
  }

  static calculateDuration(points: Point[]): Duration {
    const first = points[0]
    const last = points[points.length - 1];
    return last.time.diff(first.time);
  }

  static areLinesIntersecting(line1: Line, line2: Line): boolean {
    const [L1P1, L1P2] = line1;
    const [L2P1, L2P2] = line2;

    const slope1 = (L1P2.longitude - L1P1.longitude) / (L1P2.latitude - L1P1.latitude);
    const slope2 = (L2P2.longitude - L2P1.longitude) / (L2P2.latitude - L2P1.latitude);

    if (slope1 === slope2) {
      return false; // Lines are parallel and will never intersect
    }

    if (!isFinite(slope1)) {
      if (!isFinite(slope2)) {
        // Both lines are vertical
        if (L1P1.latitude === L2P1.latitude) {
          // Lines overlap
          return true;
        }
        return false; // Lines are parallel and will never intersect
      }
      // Only line1 is vertical
      return GeoCalculator.checkVerticalIntersect(slope2, [L1P1, L1P2], [L2P1, L2P2]);
    }

    if (!isFinite(slope2)) {
      // Only line2 is vertical
      return GeoCalculator.checkVerticalIntersect(slope1, [L2P1, L2P2], [L1P1, L1P2]);
    }

    const intercept1 = L1P1.longitude - slope1 * L1P1.latitude;
    const intercept2 = L2P1.longitude - slope2 * L2P1.latitude;
    const intersectionLatitude = (intercept2 - intercept1) / (slope1 - slope2);
    const intersectionLongitude = slope1 * intersectionLatitude + intercept1;

    return (
      GeoCalculator.isWithinRange(intersectionLatitude, Math.min(L1P1.latitude, L1P2.latitude), Math.max(L1P1.latitude, L1P2.latitude)) &&
      GeoCalculator.isWithinRange(intersectionLatitude, Math.min(L2P1.latitude, L2P2.latitude), Math.max(L2P1.latitude, L2P2.latitude)) &&
      GeoCalculator.isWithinRange(intersectionLongitude, Math.min(L1P1.longitude, L1P2.longitude), Math.max(L1P1.longitude, L1P2.longitude)) &&
      GeoCalculator.isWithinRange(intersectionLongitude, Math.min(L2P1.longitude, L2P2.longitude), Math.max(L2P1.longitude, L2P2.longitude))
    );
  }


  private static checkVerticalIntersect(slope: number, [L1P1, L1P2]: Point[], [L2P1, L2P2]: Point[]) {
    const intercept2 = L2P1.longitude - slope * L2P1.latitude;
    const intersectionLatitude = L1P1.latitude;
    const intersectionLongitude = slope * intersectionLatitude + intercept2;

    return (
      GeoCalculator.isWithinRange(intersectionLongitude, Math.min(L1P1.longitude, L1P2.longitude), Math.max(L1P1.longitude, L1P2.longitude)) &&
      GeoCalculator.isWithinRange(intersectionLatitude, Math.min(L2P1.latitude, L2P2.latitude), Math.max(L2P1.latitude, L2P2.latitude))
    );
  }

  private static isWithinRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}