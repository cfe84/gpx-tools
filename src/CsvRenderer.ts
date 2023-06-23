import { stringify } from "csv-stringify/sync";
import { Configuration } from "./Configuration";
import { IRenderer } from "./IRenderer";
import { Result } from "./Result";
import { RouteStats } from "./RouteStats";
import { Segment } from "./Segment";

export class CsvRenderer implements IRenderer {
  constructor(private configuration: Configuration) {

  }

  render(results: Result[]): void {
    const rows = [this.headers()];
    results.forEach(result => {
      if (this.configuration.segmentsFile) {
        this.renderSegments(result.segments).forEach(segmentRow => rows.push(segmentRow));
      }
    });
    console.log(stringify(rows));
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