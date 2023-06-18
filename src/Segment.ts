import { Duration } from "luxon";
import { SegmentDefinition } from "./SegmentDefinition";
import { Point } from "./Point";
import { Leg } from "./Leg";

export interface Segment {
  segmentDefinition: SegmentDefinition,
  points: Point[],
  legs: Leg[],
  time: Duration,
}