import { stringify } from "csv-stringify/sync";
import { Configuration } from "../Configuration";
import { IRenderer } from "./IRenderer";
import { Result } from "../Result";
import { TablePreRenderer } from "./TablePreRenderer";

export class CsvRenderer implements IRenderer {
  private tablePreRenderer: TablePreRenderer;
  constructor(private configuration: Configuration) {
    this.tablePreRenderer = new TablePreRenderer(configuration);
  }

  render(results: Result[]): void {
    const rows = this.tablePreRenderer.makeTable(results);
    console.log(stringify(rows));
  }
}