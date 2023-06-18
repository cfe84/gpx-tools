import * as fs from "fs";
import GpxParser from "gpx-parser-ts";
import { Point } from "./Point";
import { DateTime } from "luxon";
import { SegmentDefinition } from "./SegmentDefinition";

export class FileLoader {
  async loadGpxAsync(file: string): Promise<Point[]> {
    const parser = new GpxParser();
    const content = fs.readFileSync(file).toString();
    const trace = await parser.parse(content);
    return trace.trk.flatMap(track => track.trkseg.trkpt.map(point => ({
      latitude: point.lat,
      longitude: point.lon,
      elevation: point.ele,
      time: DateTime.fromISO(point.time as any as string),
    })));
  }

  async loadSegmentsAsync(segmentsFile: string): Promise<SegmentDefinition[]> {
    const segmentDefinitions = JSON.parse(fs.readFileSync(segmentsFile).toString());
    return segmentDefinitions;
  }
}