import { readdirSync, readFileSync } from "fs";
import { Character } from "../src/models/character";
import API from "../src/server";

export const numCharacters = readdirSync("./data/").length;

export const briv: Character = JSON.parse(readFileSync("./data/briv.json", "utf8"));
