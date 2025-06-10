import { Schema, model, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string; // ví dụ: 'user:create'
  description?: string;
  group?: string; // ví dụ: 'user', 'content', 'system'
  isSystemPermission: boolean; // true nếu là quyền mặc định không được xóa
}

const permissionSchema = new Schema<IPermission>(
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
    group: {
      type: String,
    },
    isSystemPermission: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Permission = model<IPermission>('Permission', permissionSchema);
