import * as fs from "fs";
import * as path from "path";
import GpxParser from "gpx-parser-ts";
import { DateTime } from "luxon";
import { SegmentDefinition } from "./SegmentDefinition";
import { Trace } from "./Trace";
import { Point } from "gpx-parser-ts/dist/types";

export class FileLoader {
  async loadGpxAsync(filename: string): Promise<Trace> {
    const parser = new GpxParser();
    const content = fs.readFileSync(filename).toString();
    const gpx = await parser.parse(content);
    const points = gpx.trk.flatMap(track =>
      Array.isArray(track.trkseg.trkpt)
        ? track.trkseg.trkpt.map(point => this.mapGpxPoint(point))
        : track.trkseg.trkpt
          ? [this.mapGpxPoint(track.trkseg.trkpt)]
          : []
    );
    const trace = {
      filename,
      points,
    }
    this.validateTrace(trace);
    return trace;
  }

  private mapGpxPoint(point: Point) {
    return {
      latitude: point.lat,
      longitude: point.lon,
      elevation: point.ele,
      time: DateTime.fromISO(point.time as any as string),
    };
  }

  private validateTrace(trace: Trace) {
    trace.points.forEach((point, i) => {
      if (!point) {
        console.warn(`${trace.filename}: Point ${i} is empty`)
      } else if (point.latitude === null || point.longitude === null) {
        console.warn(`${trace.filename}: Point is invalid`)
      }
    });
  }

  async loadFolderAsync(folder: string): Promise<Trace[]> {
    const content = fs.readdirSync(folder);
    const gpxFilenames = content.filter(filename => filename.endsWith(".gpx"));
    return await Promise.all(gpxFilenames.map(filename => this.loadGpxAsync(path.join(folder, filename))));
  }

  async loadSegmentsAsync(segmentsFile: string): Promise<SegmentDefinition[]> {
    const segmentDefinitions = JSON.parse(fs.readFileSync(segmentsFile).toString());
    return segmentDefinitions;
  }
}