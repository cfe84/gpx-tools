import { Duration } from "luxon";
import { GeoCalculator } from "./GeoCalculator";
import { Point } from "./Point";
import { Elevation } from "./Elevation";

export class RouteStats {
  public distanceInKm: number;
  public roundedDistanceInKm: number;
  public duration: Duration;
  public durationAsString: string;
  public averageSpeedInKph: number;
  public roundedAverageSpeedInKph: number;
  public elevation: Elevation;

  constructor(public points: Point[]) {
    this.distanceInKm = GeoCalculator.calculateTotalDistanceInMeters(points) / 1000;
    this.roundedDistanceInKm = Math.round(this.distanceInKm * 100) / 100;
    this.duration = GeoCalculator.calculateDuration(points);
    this.durationAsString = this.duration.toFormat("h:mm:ss");
    this.averageSpeedInKph = this.distanceInKm / this.duration.as("hours");
    this.roundedAverageSpeedInKph = Math.round(this.averageSpeedInKph * 100) / 100;
    this.elevation = GeoCalculator.calculateElevation(points);
  }
}