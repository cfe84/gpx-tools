import { Configuration } from "../Configuration";
import { Result } from "../Result";
import { RouteStats } from "../RouteStats";
import { Segment } from "../Segment";

export class TablePreRenderer {
  constructor(private configuration: Configuration) {
  }

  makeTable(results: Result[]): string[][] {
    let rows = results.flatMap(result => this.renderSegments(result.segments));
    rows = this.sortRows(rows);
    rows.splice(0, 0, this.headers());
    return rows;
  }

  private sortRows(rows: any[][]) {
    if (this.configuration.sort) {
      const headers = this.headers();
      const index = headers.indexOf(this.configuration.sort);
      if (index < 0) {
        throw Error("Unknown column: " + this.configuration.sort);
      }
      rows = rows.sort((a, b) => typeof (a[index]) === "number"
        ? (a[index] as number) - (b[index] as number)
        : `${a[index]}`.localeCompare(`${b[index]}`));
    }
    return rows;
  }

  private headers() {
    return ["date", "segment", "distance", "duration", "durationInS", "averageSpeedInKph", "elevationGain", "elevationLoss", "highestPoint", "lowestPoint"];
  }

  private renderSegments(segments: Segment[]): any[] {
    let rows = segments.map((segment, i) => {
      const stats = new RouteStats(segment.points);
      return [
        segment.points[0].time.toISODate(),
        segment.segmentDefinition.name,
        stats.distanceInKm,
        stats.durationAsString,
        stats.duration.as("seconds"),
        stats.averageSpeedInKph,
        stats.elevation.up,
        stats.elevation.down,
        stats.elevation.top,
        stats.elevation.bottom,
      ]
    });

    return rows;
  }

}