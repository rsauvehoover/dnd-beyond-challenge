import { Schema, model } from "mongoose";

const characterSchema = new Schema<Character>({
  name: String,
  level: Number,
  hitPoints: Number,
  classes: [
    {
      name: String,
      hitDiceValue: Number,
      classLevel: Number
    }
  ],
  stats: {
    strength: Number,
    dexterity: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
  },
  items: [
    {
      name: String,
      modifier: {
        affectedObject: String,
        affectedValue: String,
        value: Number
      }
    }
  ],
  defenses: [
    {
      type: { type: String },
      defense: String
    }
  ]
});

export const CharacterModel = model("Character", characterSchema);

export interface Character {
  name: string,
  level: number,
  hitPoints: number,
  temporaryHitPoints: number,
  classes: CharacterClass[],
  stats: CharacterStats,
  items: Item[],
  defenses: Defense[],
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterClass {
  name: string,
  hitDiceValue: number,
  classLevel: number
}

export interface ItemModifier {
  affectedObject: string,
  affectedValue: string,
  value: number
}

export interface Item {
  name: string,
  modifier: ItemModifier,
}


export interface Defense {
  type: string,
  defense: string,
}
