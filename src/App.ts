import { Configuration } from "./Configuration";
import { FileLoader } from "./FileLoader";
import { SegmentFinder } from "./SegmentFinder";
import { Trace } from "./Trace";
import { IRenderer } from "./rendering/IRenderer";
import { Result } from "./Result";
import { Segment } from "./Segment";

export interface AppDeps {
  loader: FileLoader,
  renderer: IRenderer,
}

export class App {

  constructor(private deps: AppDeps) { }

  async runAsync(configuration: Configuration) {
    let traces: Trace[] = [];
    if (configuration.file) {
      traces = [await this.deps.loader.loadGpxAsync(configuration.file)];
    } else if (configuration.folder) {
      traces = await this.deps.loader.loadFolderAsync(configuration.folder);
    }
    const results = [];
    for (const trace of traces) {
      const result: Result = {
        segments: [],
        trace,
      };
      if (configuration.segmentsFile) {
        result.segments = await this.segmentsAsync(configuration.segmentsFile, trace);
      }
      results.push(result);
    }
    this.deps.renderer.render(results);
  }

  private async segmentsAsync(segmentsFile: string, trace: Trace): Promise<Segment[]> {
    const segmentDefinitions = await this.deps.loader.loadSegmentsAsync(segmentsFile);
    const segmentFinder = new SegmentFinder(segmentDefinitions);
    const segments = segmentFinder.identifySegments(trace);
    return segments;
  }

}