import { Configuration } from "../Configuration";
import { Result } from "../Result";
import { RouteStats } from "../RouteStats";
import { Segment } from "../Segment";
import * as path from "path";

export class TablePreRenderer {
  constructor(private configuration: Configuration) {
  }

  makeTable(results: Result[]): string[][] {
    let rows = results.flatMap(result => this.renderSegments(result.trace.filename, result.segments));
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
    return [
      // "file", 
      "date",
      "segment",
      "distance",
      "duration",
      "averageSpeedInKph",
      "elevationGain",
      "elevationLoss",
      "highestPoint",
      "lowestPoint",
    ];
  }

  private renderSegments(file: string, segments: Segment[]): any[] {
    let rows = segments.map((segment, i) => {
      const stats = new RouteStats(segment.points);
      return [
        // path.basename(file),
        segment.points[0].time.toISODate(),
        segment.segmentDefinition.name,
        stats.distanceInKm,
        stats.durationAsString,
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