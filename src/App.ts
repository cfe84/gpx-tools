import { Configuration } from "./Configuration";
import { GeoCalculator } from "./GeoCalculator";
import { FileLoader } from "./FileLoader";
import { Point } from "./Point";
import { SegmentFinder } from "./SegmentFinder";

export interface AppDeps {
  loader: FileLoader,
}

export class App {

  constructor(private deps: AppDeps) { }

  async runAsync(configuration: Configuration) {
    const trace = await this.deps.loader.loadGpxAsync(configuration.file);
    if (configuration.stats) {
      await this.statsAsync(trace);
    }
    if (configuration.segmentsFile) {
      await this.segmentsAsync(configuration.segmentsFile, trace);
    }
  }

  private async segmentsAsync(segmentsFile: string, trace: Point[]) {
    const segmentDefinitions = await this.deps.loader.loadSegmentsAsync(segmentsFile);
    const segmentFinder = new SegmentFinder(segmentDefinitions);
    const segments = segmentFinder.identifySegments(trace);
    segments.forEach((segment, i) => {
      console.log(`Segment ${i + 1}: ${segment.segmentDefinition.name}`);
      this.statsAsync(segment.points);
    });
  }

  private async statsAsync(trace: Point[]) {
    const distanceInKm = GeoCalculator.calculateTotalDistanceInMeters(trace) / 1000;
    const duration = GeoCalculator.calculateDuration(trace);
    const speedInKph = distanceInKm / duration.as("hours");
    console.log(`Distance: ${Math.round(distanceInKm * 100) / 100}km`);
    console.log(`Duration: ${duration.toFormat("h:mm:ss")}`);
    console.log(`Average speed: ${Math.round(speedInKph * 100) / 100}km/h`);
  }
}