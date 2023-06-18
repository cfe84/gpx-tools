import { DateTime } from "luxon";

export interface Point {
  latitude: number,
  longitude: number,
  elevation: number,
  time: DateTime,
}