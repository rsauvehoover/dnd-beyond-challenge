import { CharacterModel, Character } from "../models/character";
import { DamageInstance, DefenseType } from "../models/damage";

export interface IHealPayload {
  name: string;
  value: number;
}

export interface IDamagePayload {
  name: string;
  damageInstances: DamageInstance[];
}

export interface ITempHpPayload {
  name: string;
  value: number;
}

export async function getAll(): Promise<Character[]> {
  return await CharacterModel.find({});
}

export async function getCharacter(name: string): Promise<Character | null> {
  return await CharacterModel.findOne({ name: { $regex: `^${name}$`, $options: "i" } }).exec();
}

export async function heal(payload: IHealPayload) {
  const char = await CharacterModel.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" }
  });
  if (!char) return null;
  if (char.maxHitPoints) {
    char.hitPoints = Math.min(char.hitPoints + payload.value, char.maxHitPoints);
  }
  char.save();
  return char;
}

export async function damage(payload: IDamagePayload): Promise<Character | null> {
  const char = await CharacterModel.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" }
  });
  if (!char) return null;

  // handle damage resists and immunities
  let resistances = [];
  let immunities = [];
  for (const defense of char.defenses) {
    if (defense.defense == DefenseType.immmunity) {
      immunities.push(defense.type);
    } else {
      resistances.push(defense.type);
    }
  }

  let damageTaken = 0;
  for (const instance of payload.damageInstances) {
    // Check immunity first in case the character has both resistance and immunity for some reason
    if (immunities.includes(instance.type)) {
      continue;
    } else if (resistances.includes(instance.type)) {
      // Round down in all cases unless there's a specific rule around it, and we want to
      // ensure damage rolls are positive
      damageTaken += Math.floor(Math.max(0, instance.roll) / 2);
    } else {
      damageTaken += Math.max(0, instance.roll);
    }
  }

  // remove damage from temp hp first
  if (char.temporaryHitPoints! > 0) {
    const tmpDmg = damageTaken;
    damageTaken = Math.max(0, damageTaken - char.temporaryHitPoints!);
    char.temporaryHitPoints = Math.max(0, char.temporaryHitPoints! - tmpDmg);
  }

  // ensure damage doesn't result in negative hp
  char.hitPoints = Math.max(0, char.hitPoints - damageTaken);

  char.save();
  return char;
}

export async function addTemporaryHp(payload: ITempHpPayload) {
  const char = await CharacterModel.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" }
  });
  if (!char) return null;
  // temporary hp is always going to be present due to how we initialize characters in the db
  if (char.temporaryHitPoints! < payload.value) {
    char.temporaryHitPoints = payload.value;
    char.save();
  }
  return char;
}
