import { Configuration } from "./Configuration";
import { GeoCalculator } from "./GeoCalculator";
import { IRenderer } from "./IRenderer";
import { Point } from "./Point";
import { Result } from "./Result";
import { RouteStats } from "./RouteStats";
import { Segment } from "./Segment";

export class ConsoleRenderer implements IRenderer {
  constructor(private configuration: Configuration) { }

  render(results: Result[]): void {
    results.forEach(result => {
      if (this.configuration.stats) {
        this.stats(new RouteStats(result.trace.points));
      }
      if (this.configuration.segmentsFile) {
        this.renderSegments(result.segments);
      }
    });
  }

  private renderSegments(segments: Segment[]) {
    segments.forEach((segment, i) => {
      console.log(`Segment ${i + 1}: ${segment.segmentDefinition.name}`);
      this.stats(new RouteStats(segment.points));
    });
  }

  private stats(routeStats: RouteStats) {
    console.log(`Distance: ${routeStats.roundedDistanceInKm}km`);
    console.log(`Duration: ${routeStats.durationAsString}`);
    console.log(`Average speed: ${routeStats.roundedAverageSpeedInKph}km/h`);
  }
}