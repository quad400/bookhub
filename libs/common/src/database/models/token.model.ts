import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "../abstract.schema";

export type TokenDocument = Token & Document;

@Schema({versionKey: false, timestamps: true})
export class Token extends AbstractDocument{

    @Prop({type: String, ref: "User", required: true})
    user: string

    @Prop({type: String})
    token: string

    @Prop({type: Date})
    token_expired_at: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token);
