import { Schema, model } from "mongoose";

const characterSchema = new Schema<Character>({
  name: String,
  level: Number,
  hitPoints: Number,
  maxHitPoints: Number,
  temporaryHitPoints: { type: Number, default: 0 },
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
}, {
  toJSON: {
    // Remove all the internal properties before rendering json since users don't
    // need to know, kind of a gross way to do it but it works for now.
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret._id;
      ret.classes.forEach((c: any) => {
        delete c._id
      })
      ret.items.forEach((c: any) => {
        delete c._id
      })
      ret.defenses.forEach((c: any) => {
        delete c._id
      })
    }
  }
});

// Add max hp to the document before being added to DB assumption is that the hp
// set in the original json character description is the pcs max hp
characterSchema.pre('save', function () {
  if (!this.maxHitPoints) {
    this.maxHitPoints = this.hitPoints;
  }
})

export const CharacterModel = model("Character", characterSchema);

export interface Character {
  name: string,
  level: number,
  hitPoints: number,
  maxHitPoints?: number,
  temporaryHitPoints?: number,
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
