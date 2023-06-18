import { App } from "./App";
import { ConfigurationProvider } from "./ConfigurationProvider";
import { FileLoader } from "./FileLoader";

const options = ConfigurationProvider.loadConfiguration();
const deps = {
  loader: new FileLoader(),
};
const app = new App(deps);
app.runAsync(options).then();