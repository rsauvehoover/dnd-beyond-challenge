import { readFile } from "fs/promises";
import { Character } from "../models/character";

// Helper to parse character data from local json files
// within the scope of this assignment this assumes that all character json files
// are properly formed and follow the standard model provided.
export async function loadCharacterFromFile(path: string): Promise<Character | null> {
  try {
    const data = await readFile(path, "utf8");
    return JSON.parse(data);
  }
  catch {
    return null;
  }
}
