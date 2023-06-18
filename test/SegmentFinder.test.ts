import * as should from "should";
import { FileLoader } from "../src/FileLoader";
import { SegmentFinder } from "../src/SegmentFinder";

describe('Segment finder', () => {
  it("should find traces", async () => {
    // given
    const loader = new FileLoader();
    const trace = await loader.loadGpxAsync(__dirname + "/data/trace.gpx");
    const segmentDefinitions = await loader.loadSegmentsAsync(__dirname + "/data/segments.json");


    // when
    const segmentFinder = new SegmentFinder(segmentDefinitions);
    const segments = segmentFinder.identifySegments(trace);

    // then
    should(segments).have.lengthOf(3);

    const segmentsToFind = [
      { name: "Segment with two laps", legs: 1, timeInSeconds: 390 },
      { name: "Espresso", legs: 1, timeInSeconds: 485 },
      { name: "Segment with two laps", legs: 1, timeInSeconds: 234 },
    ]
    for (let i = 0; i < segmentsToFind.length; i++) {
      const segment = segments[i];
      const segmentToFind = segmentsToFind[i];
      should(segment.legs).have.length(segmentToFind.legs);
      should(segment.segmentDefinition.name).eql(segmentToFind.name);
      should(segment.time.as("seconds")).eql(segmentToFind.timeInSeconds);
    }
  });
});