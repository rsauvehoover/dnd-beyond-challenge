import { readdirSync } from "fs";
import { Character } from "../src/models/character";

export const numCharacters = readdirSync("./data/").length;

export const briv: Character = {
  name: "Briv",
  level: 5,
  hitPoints: 25,
  classes: [
    {
      name: "fighter",
      hitDiceValue: 10,
      classLevel: 5
    }
  ],
  stats: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 10,
    charisma: 8
  },
  items: [
    {
      name: "Ioun Stone of Fortitude",
      modifier: {
        affectedObject: "stats",
        affectedValue: "constitution",
        value: 2
      }
    }
  ],
  defenses: [
    {
      type: "fire",
      defense: "immunity"
    },
    {
      type: "slashing",
      defense: "resistance"
    }
  ]
};
