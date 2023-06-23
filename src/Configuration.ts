export type OutputType = "text" | "csv" | "table";

export interface Configuration {
  file?: string,
  folder?: string,
  sort?: string,
  segmentsFile: string | null,
  stats: boolean,
  output: OutputType,
}