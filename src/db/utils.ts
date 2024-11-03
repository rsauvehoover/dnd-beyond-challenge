import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { Character } from "../models/character";

// Helpers to parse character data from local json files
// within the scope of this assignment this assumes that all character json files
// are properly formed and follow the standard model provided.

const DATA_DIR = "./data"

async function loadCharacterFromFile(name: string): Promise<Character> {
  try {
    const data = await readFile(join(DATA_DIR, name), "utf8");
    return JSON.parse(data);
  }
  catch {
    return {} as Character;
  }
}

export async function loadCharacter(name: string): Promise<Character> {
  return await loadCharacterFromFile(`${name}.json`);
}

export async function getAllCharacters(): Promise<(Character | null)[]> {
  try {
    const names = await readdir(DATA_DIR);
    return await Promise.all(names.map((name) => loadCharacterFromFile(name)))
  }
  catch {
    return [];
  }
}
