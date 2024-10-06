import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "../../abstract.schema";
import { MessageAttachmentEnum } from "@app/common/enum";


@Schema({versionKey: false})
export class Attachment extends AbstractDocument{
    @Prop({type: String, ref: "Message", required: true})
    message: string

    @Prop({enum: MessageAttachmentEnum, default: MessageAttachmentEnum.IMAGE})
    type: string
    
    @Prop({type: String, required:true})
    file: string
}


export const AttachmentSchema = SchemaFactory.createForClass(Attachment)