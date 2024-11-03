import { Get, Post, Route, Tags, Path } from "tsoa";

import { getCharacters } from "../db/characters";
import { loadCharacter } from "../db/utils";
import { type Character } from "../models/character";

@Route("characters")
@Tags("Characters")
export default class CharacterController {
  @Get("/")
  public async getCharacters(): Promise<Character[]> {
    return getCharacters();
  }
  @Get("/:name")
  public async getCharacter(@Path() name: string): Promise<Character> {
    return loadCharacter(name);
  }
  @Post("/:name/heal")
  public async healCharacter(@Path() name: string): Promise<string> {
    return "";
  }
  @Post("/:name/dealDamage")
  public async dealDamage(@Path() name: string): Promise<string> {
    return "";
  }
  @Post("/:name/addTemporaryHp")
  public async addTemporaryHp(@Path() name: string): Promise<string> {
    return "";
  }
}
