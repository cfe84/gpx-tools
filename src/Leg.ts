import { Duration } from "luxon";
import { Point } from "./Point";

export interface Leg {
  start: Point,
  finish: Point,
  points: Point[],
  time: Duration,
}