import { Get, Post, Route, Tags, Path } from "tsoa";

import { getCharacters, getCharacter } from "../db/characters";
import { type Character } from "../models/character";

@Route("characters")
@Tags("Characters")
export default class CharacterController {
  @Get("/")
  public async getCharacters(): Promise<Character[]> {
    return await getCharacters();
  }
  @Get("/:name")
  public async getCharacter(@Path() name: string): Promise<Character | null> {
    return await getCharacter(name);
  }
  @Post("/:name/heal")
  public async healCharacter(@Path() name: string): Promise<Character | null> {
    const char = await getCharacter(name);
    if (!char) return null;
    return char;
  }

  @Post("/:name/dealDamage")
  public async dealDamage(@Path() name: string): Promise<Character | null> {
    const char = await getCharacter(name);
    if (!char) return null;
    return char
  }
  @Post("/:name/addTemporaryHp")
  public async addTemporaryHp(@Path() name: string): Promise<Character | null> {
    const char = await getCharacter(name);
    if (!char) return null;
    return char;
  }
}
