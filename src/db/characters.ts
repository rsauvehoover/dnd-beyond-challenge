import { CharacterModel, Character } from "../models/character";
import { DamageInstance } from "../models/damage";

const EXCLUDED_FIELDS = {
  "_id": 0,
  "__v": 0,
  "classes._id": 0,
  "items._id": 0,
  "defenses._id": 0,
}

export async function getCharacters(): Promise<Character[]> {
  return await CharacterModel.find({}, EXCLUDED_FIELDS)
}

export async function getCharacter(name: string): Promise<Character | null> {
  return await CharacterModel.findOne({ name: { '$regex': `^${name}$`, $options: 'i' } }, EXCLUDED_FIELDS).exec();
}

export async function healCharacter(name: string, roll: number) {

}

export async function damageCharacter(name: string, damage: DamageInstance) {

}

export async function addTemporaryHp(name: string, roll: number) {

}
