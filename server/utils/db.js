import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../data/db.json');

// Read the entire db.json and return it as a JS object
export const readDB = () => {
  const raw = readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
};

// Write the updated JS object back to db.json
export const writeDB = (data) => {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};
