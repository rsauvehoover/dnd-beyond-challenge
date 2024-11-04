import { Get, Post, Route, Tags, Path, Body } from "tsoa";

import { getAll, getCharacter, heal, damage, addTemporaryHp, type IDamagePayload, type IHealPayload, type ITempHpPayload } from "../db/characters";
import { type Character } from "../models/character";

@Route("characters")
@Tags("Characters")
export default class CharacterController {
  @Get("/")
  public async getCharacters(): Promise<Character[]> {
    return await getAll();
  }
  @Get("/:name")
  public async getCharacter(@Path() name: string): Promise<Character | null> {
    return await getCharacter(name);
  }
  @Post("/heal")
  public async healCharacter(@Body() payload: IHealPayload): Promise<Character | null> {
    const char = await heal(payload);
    if (!char) return null;
    return char;
  }

  @Post("/dealDamage")
  public async dealDamage(@Body() payload: IDamagePayload): Promise<Character | null> {
    const char = await damage(payload);
    if (!char) return null;
    return char
  }
  @Post("/addTemporaryHp")
  public async addTemporaryHp(@Body() payload: ITempHpPayload): Promise<Character | null> {
    const char = await addTemporaryHp(payload);
    if (!char) return null;
    return char;
  }
}
