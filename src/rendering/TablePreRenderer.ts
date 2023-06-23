import { Configuration } from "../Configuration";
import { Result } from "../Result";
import { RouteStats } from "../RouteStats";
import { Segment } from "../Segment";

export class TablePreRenderer {
  constructor(private configuration: Configuration) {
  }

  makeTable(results: Result[]): string[][] {
    const rows = [this.headers()];
    results.forEach(result => {
      if (this.configuration.segmentsFile) {
        this.renderSegments(result.segments).forEach(segmentRow => rows.push(segmentRow));
      }
    });
    return rows;
  }

  private headers() {
    return ["date", "segment", "distance", "duration", "durationInS", "averageSpeedInKph"];
  }

  private renderSegments(segments: Segment[]): any[] {
    return segments.map((segment, i) => {
      const stats = new RouteStats(segment.points);
      return [
        segment.points[0].time.toISODate(),
        segment.segmentDefinition.name,
        stats.distanceInKm,
        stats.durationAsString,
        stats.duration.as("seconds"),
        stats.averageSpeedInKph,
      ]
    });
  }

}