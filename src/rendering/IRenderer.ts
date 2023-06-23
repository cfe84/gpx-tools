import { Result } from "../Result";

export interface IRenderer {
  render(results: Result[]): void;
}