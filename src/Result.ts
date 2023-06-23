import { Segment } from "./Segment";
import { Trace } from "./Trace";

export interface Result {
  trace: Trace;
  segments: Segment[];
}