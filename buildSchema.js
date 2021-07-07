import { writeFile, mkdir } from "fs/promises";
import { resolve } from "path";
import { argv } from "process";
import * as TJS from "typescript-json-schema";

const version = process.env.npm_package_version;
let folderPathName = "docs/schema";
let fileName = `schema@${version}.json`;
if (argv.length > 2) {
  folderPathName = argv[2];
  if (argv.length > 3) {
    fileName = argv[3];
  }
}

const wrapperProgram = TJS.getProgramFromFiles([resolve("./wrapper.d.ts")], {
  strictNullChecks: true,
});
const schema = TJS.generateSchema(wrapperProgram, "DAEntityExportType", {
  defaultProps: false,
  required: true,
  defaultNumberType: "integer",
});

const data = new Uint8Array(Buffer.from(JSON.stringify(schema)));
const folderPath = resolve(folderPathName);
const path = resolve(folderPath, fileName);

await mkdir(folderPath, { recursive: true });
await writeFile(path, data);
