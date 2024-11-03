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

export interface DamageInstance {
  type: DamageType;
  roll: number;
}
