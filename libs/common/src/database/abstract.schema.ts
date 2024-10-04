import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import {v4 as uuidv4} from "uuid"

@Schema()
export class AbstractDocument extends Document{

  @Prop({type: String})
  _id: string

  @Prop({type: Boolean, default: false})
  is_deleted: boolean
}
