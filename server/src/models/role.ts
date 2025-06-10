import { Schema, model, Document, Types } from 'mongoose';
import { IPermission } from './permission';

export interface IRole extends Document {
  name: string; // ví dụ: 'superadmin', 'admin', 'editor', 'user'
  description?: string;
  permissions: Types.ObjectId[];
  isSystemRole: boolean; // true nếu là role gốc không được xóa
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
    isSystemRole: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Role = model<IRole>('Role', roleSchema);
