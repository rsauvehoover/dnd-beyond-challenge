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

export enum DefenseType {
  resistance = "resistance",
  immmunity = "immunity"
}

export enum DamageType {
  bludgeoning = "bludgeoning",
  piercing = "piercing",
  slashing = "slashing",
  fire = "fire",
  cold = "cold",
  acid = "acid",
  thunder = "thunder",
  lightning = "lightning",
  poison = "poison",
  radiant = "radiant",
  necrotic = "necrotic",
  psychic = "psychic",
  force = "force",
}

export interface Defense {
  type: DamageType,
  defense: DefenseType,
}

export interface Character {
  name: string,
  leve: number,
  hitPoints: number,
  classes: CharacterClass[],
  stats: CharacterStats,
  items: Item[],
  defenses: Defense[],
}
