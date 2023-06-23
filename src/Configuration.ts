export type OutputType = "text" | "csv";

export interface Configuration {
  file?: string,
  folder?: string,
  segmentsFile: string | null,
  stats: boolean,
  output: OutputType,
}