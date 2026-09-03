/**
 * Generate `src/api/schema.d.ts` from the backend's OpenAPI document (T010).
 *
 * Usage:
 *   npm run gen:api                       # reads http://localhost:8000/openapi.json
 *   OPENAPI_URL=http://host/openapi.json npm run gen:api
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import openapiTS, { astToString } from "openapi-typescript";

const source = process.env.OPENAPI_URL ?? "http://localhost:8000/openapi.json";
const outFile = fileURLToPath(new URL("../src/api/schema.d.ts", import.meta.url));

async function main(): Promise<void> {
  const ast = await openapiTS(new URL(source));
  const header = `// AUTO-GENERATED from ${source} — do not edit by hand.\n`;
  await writeFile(outFile, header + astToString(ast), "utf8");
  console.log(`Wrote ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
