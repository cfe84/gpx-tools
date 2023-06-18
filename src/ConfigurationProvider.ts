import * as usage from "command-line-usage";
import { parseCommandLine, ParsingResult } from "yaclip";

import { Configuration } from "./Configuration";

export class ConfigurationProvider {
  static loadConfiguration(): Configuration {
    const options = [
      {
        name: "file",
        alias: "f",
        type: String,
        description: "Path to GPX file to load",
      },
      {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Display help",
      },
      {
        name: "segments",
        alias: "s",
        type: String,
        description: "Path to segments file",
      },
      {
        name: "stats",
        alias: "S",
        type: Boolean,
        description: "Print stats",
      },
    ];

    function displayHelp() {
      const structure = [
        {
          header: "gpx-tools",
        },
        {
          header: "Commands",
          optionList: options,
        },
      ];
      const message = usage(structure);
      console.log(message);
    }

    let commands: ParsingResult;

    try {
      commands = parseCommandLine(options, { dashesAreOptional: true });
    } catch (error: any) {
      console.error(error.message);
      displayHelp();
      process.exit(1);
    }

    if (commands["help"]) {
      displayHelp();
      process.exit(0);
    }

    function getCommandValue(commandName: string): string | null {
      return commands[commandName]
        ? (commands[commandName] as any).value
        : null;
    }

    const file = getCommandValue("file");
    const segmentsFile = getCommandValue("segments") || null;
    const stats = !!commands["stats"];

    const checkVariable = (variable: any, message: string) => {
      if (!variable) {
        console.error(message);
        displayHelp();
        process.exit(1);
      }
    };

    checkVariable(file, "File missing");

    return {
      file: file as string,
      segmentsFile,
      stats,
    };
  }


}