import { GeoCalculator } from "../src/GeoCalculator";
import { Point } from '../src/Point';
import { DateTime } from 'luxon';
import * as should from "should"

describe('Line Intersection', () => {
  it('should detect intersection when lines cross each other', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 0, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 10, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 0, longitude: 10, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 0, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    should(result).be.true();
  });

  it('should detect no intersection when lines are parallel', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 0, elevation: 0, time: DateTime.now() },
      { latitude: 5, longitude: 5, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 1, longitude: 1, elevation: 0, time: DateTime.now() },
      { latitude: 6, longitude: 6, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    result.should.be.false();
  });

  it('should detect intersection when one line is vertical and they overlap', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 5, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 5, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 5, longitude: 0, elevation: 0, time: DateTime.now() },
      { latitude: 5, longitude: 10, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line2, line1);
    result.should.be.true();
  });

  it('should detect no intersection when one line is vertical and they do not overlap', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 5, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 5, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 5, longitude: 1, elevation: 0, time: DateTime.now() },
      { latitude: 5, longitude: 4, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    should(result).be.false();
  });

  it('should detect no intersection when both lines are vertical and they do not overlap', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 3, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 4, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 5, longitude: 6, elevation: 0, time: DateTime.now() },
      { latitude: 5, longitude: 10, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    result.should.be.false();
  });

  it('should detect intersection when both lines are vertical and they overlap', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 5, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 5, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 5, longitude: 5, elevation: 0, time: DateTime.now() },
      { latitude: 5, longitude: 10, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    result.should.be.true();
  });

  it('should detect intersection when lines intersect at an endpoint', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 0, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 10, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 10, longitude: 10, elevation: 0, time: DateTime.now() },
      { latitude: 15, longitude: 1, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    result.should.be.true();
  });

  it('should detect no intersection when lines do not intersect', () => {
    const line1: [Point, Point] = [
      { latitude: 0, longitude: 0, elevation: 0, time: DateTime.now() },
      { latitude: 5, longitude: 5, elevation: 0, time: DateTime.now() }
    ];
    const line2: [Point, Point] = [
      { latitude: 6, longitude: 6, elevation: 0, time: DateTime.now() },
      { latitude: 10, longitude: 10, elevation: 0, time: DateTime.now() }
    ];
    const result = GeoCalculator.areLinesIntersecting(line1, line2);
    result.should.be.false();
  });
});