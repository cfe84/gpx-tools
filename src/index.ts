import { App } from "./App";
import { ConfigurationProvider } from "./ConfigurationProvider";
import { ConsoleRenderer } from "./rendering/ConsoleRenderer";
import { CsvRenderer } from "./rendering/CsvRenderer";
import { FileLoader } from "./FileLoader";
import { TableRenderer } from "./rendering/TableRenderer";

const options = ConfigurationProvider.loadConfiguration();
const renderer =
  options.output === "csv" ? new CsvRenderer(options)
    : options.output === "table" ? new TableRenderer(options)
      : new ConsoleRenderer(options);
const deps = {
  loader: new FileLoader(),
  renderer,
};
const app = new App(deps);
app.runAsync(options).then();