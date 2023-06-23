import { Duration } from "luxon";
import { GeoCalculator } from "./GeoCalculator";
import { Line } from "./Line";
import { Segment } from "./Segment";
import { SegmentDefinition } from "./SegmentDefinition";
import { Trace } from "./Trace";

export interface SegmentReader {
  index: number;
  segment: Segment;
}

const durationZero = Duration.fromMillis(0);

function newSegment(segmentDefinition: SegmentDefinition) {
  return {
    legs: [],
    points: [],
    segmentDefinition,
    time: durationZero,
  };
}

export class SegmentFinder {
  constructor(private segmentDefinitions: SegmentDefinition[]) { }

  identifySegments(trace: Trace): Segment[] {
    let segments: Segment[] = [];
    const points = trace.points;
    let segmentReaders: SegmentReader[] = this.segmentDefinitions.map(segmentDefinition => ({
      index: 0,
      segment: newSegment(segmentDefinition),
    }));

    let previousPoint = points[0];
    let i = 1;
    for (let point of points) {
      const line: Line = [previousPoint, point];
      for (let segmentReader of segmentReaders) {
        const segmentDefinition = segmentReader.segment.segmentDefinition;
        // Crosses the starting line - we re-start.
        if (GeoCalculator.areLinesIntersecting(line, segmentDefinition.lines[0])) {
          segmentReader.index = 1;
          segmentReader.segment.legs = [
            {
              start: previousPoint,
              finish: previousPoint,
              points: [
                previousPoint,
              ],
              time: durationZero,
            }
          ];
          segmentReader.segment.points = [
            previousPoint,
          ];
        }
        if (segmentReader.index > 0) {
          const currentLeg = segmentReader.segment.legs[segmentReader.index - 1];

          // Still in segment, pushing point to all points and to the current leg.
          segmentReader.segment.points.push(point);
          currentLeg.points.push(point);

          // Crosses the next leg
          if (GeoCalculator.areLinesIntersecting(line, segmentDefinition.lines[segmentReader.index])) {
            currentLeg.finish = point;
            currentLeg.time = currentLeg.finish.time.diff(currentLeg.start.time); // see if that's useful...
            segmentReader.index++;

            // Crosses the finish line - we save and restart.
            if (segmentReader.index >= segmentDefinition.lines.length) {
              segmentReader.segment.time = point.time.diff(segmentReader.segment.legs[0].start.time);
              segments.push(segmentReader.segment);
              segmentReader.index = 0;
              segmentReader.segment = newSegment(segmentReader.segment.segmentDefinition);
            } else {
              // Else switch to next leg
              segmentReader.segment.legs.push({
                start: previousPoint,
                finish: previousPoint,
                points: [previousPoint],
                time: durationZero,
              });
            }
          }
        }
      }
      previousPoint = point;
    }

    return segments;
  }
}