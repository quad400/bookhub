import { Prop, Schema } from "@nestjs/mongoose";
import { AbstractDocument } from "../../abstract.schema";
import { MessageAttachmentEnum } from "@app/common/enum";


@Schema({versionKey: false})
export class Attachments extends AbstractDocument{
    @Prop({type: String, ref: "Message", required: true})
    message: string

    @Prop({type: MessageAttachmentEnum, default: MessageAttachmentEnum.IMAGE})
    type: string

    
}