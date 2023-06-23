import { App } from "./App";
import { ConfigurationProvider } from "./ConfigurationProvider";
import { ConsoleRenderer } from "./ConsoleRenderer";
import { CsvRenderer } from "./CsvRenderer";
import { FileLoader } from "./FileLoader";

const options = ConfigurationProvider.loadConfiguration();
const renderer =
  options.output === "csv" ? new CsvRenderer(options)
    : new ConsoleRenderer(options);
const deps = {
  loader: new FileLoader(),
  renderer,
};
const app = new App(deps);
app.runAsync(options).then();