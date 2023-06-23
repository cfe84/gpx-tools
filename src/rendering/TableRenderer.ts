import { Configuration } from "../Configuration";
import { Result } from "../Result";
import { IRenderer } from "./IRenderer";
import { TablePreRenderer } from "./TablePreRenderer";

function pad(str: string, length: number, pad: string) {
  for (let i = str.length; i < length; i++) {
    str += pad;
  }
  return str;
}

export class TableRenderer implements IRenderer {
  private tablePreRenderer: TablePreRenderer;
  constructor(private configuration: Configuration) {
    this.tablePreRenderer = new TablePreRenderer(configuration);
  }

  render(results: Result[]): void {
    const rows = this.tablePreRenderer.makeTable(results);
    const widths = rows[0].map(_ => 0);
    const sep = rows[0].map(_ => "-");
    rows.splice(1, 0, sep);
    rows.forEach(row => row.forEach((col, i) => {
      const length = `${col}`.length;
      if (length > widths[i]) {
        widths[i] = length;
      }
    }));
    const enlargedCols = rows.map((row, j) => row.map((col, i) =>
      pad(`${col}`, widths[i], j === 1 ? "-" : " ")
    ));
    enlargedCols.forEach(row => {
      console.log(row.join(" | "))
    })
  }
}