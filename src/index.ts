import * as fs from 'node:fs';
import * as path from 'node:path';
import { COSCUP_YEAR, makeData } from './util';
import type { RawData } from './types/raw-data';
import type { Data } from './types/data';

export async function getRawData(): Promise<RawData> {
  const rawDataUrl = `https://coscup.org/${COSCUP_YEAR}/json/session.json`;
  const rawData = await fetch(rawDataUrl).then((res) => res.json()) as RawData;

  return rawData;
}

export async function getData(): Promise<Data> {
  const rawData = await getRawData();
  const data = makeData(rawData);

  return data;
}

async function main() {
  const rawData = await getRawData();

  fs.writeFileSync(
    path.join(__dirname, '../data/raw-data.json'),
    JSON.stringify(rawData, null, '\t'),
  );

  const data = makeData(rawData);

  fs.writeFileSync(
    path.join(__dirname, '../data/data.json'),
    JSON.stringify(data, null, '\t'),
  );
}

if (require.main === module) {
  main();
}
