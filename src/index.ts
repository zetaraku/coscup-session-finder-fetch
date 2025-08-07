import * as fs from 'node:fs';
import * as path from 'node:path';
import { makeData } from './util';
import type { RawData } from './types/raw-data';
import type { Data } from './types/data';

export async function getRawData(year: string): Promise<RawData> {
  const rawDataUrl = `https://coscup.org/${year}/json/session.json`;
  const rawData = await fetch(rawDataUrl).then((res) => res.json()) as RawData;

  return rawData;
}

export async function getData(year: string, days: string[], timezone: string): Promise<Data> {
  const rawData = await getRawData(year);
  const data = makeData(rawData, year, days, timezone);

  return data;
}

async function main() {
  const COSCUP_YEAR = process.env.COSCUP_YEAR ?? '2077';
  const COSCUP_DAYS = JSON.parse(process.env.COSCUP_DAYS ?? '[]') as string[];
  const COSCUP_TIMEZONE = process.env.COSCUP_TIMEZONE ?? '+08:00';

  const rawData = await getRawData(COSCUP_YEAR);

  fs.writeFileSync(
    path.join(__dirname, '../data/raw-data.json'),
    JSON.stringify(rawData, null, '\t'),
  );

  const data = makeData(rawData, COSCUP_YEAR, COSCUP_DAYS, COSCUP_TIMEZONE);

  fs.writeFileSync(
    path.join(__dirname, '../data/data.json'),
    JSON.stringify(data, null, '\t'),
  );
}

if (require.main === module) {
  main();
}
