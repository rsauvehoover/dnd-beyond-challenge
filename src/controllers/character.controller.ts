import { Get, Post, Route, Tags, Path } from "tsoa";

import { type Character } from "../models/character";

@Route("character")
@Tags("Character")
export default class CharacterController {
  @Get("/")
  public async getCharacters(): Promise<Character[]> {
    return []
  }
  @Get("/:id")
  public async getCharacter(@Path() id: string): Promise<Character | null> {
    return {} as Character
  }
  // @Post("/:id/heal")
  // @Post("/:id/dealDamage")
  // @Post("/:id/addTemporaryHp")
}
