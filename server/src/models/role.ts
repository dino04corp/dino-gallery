import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  name: string; // ví dụ: 'superadmin', 'admin', 'editor', 'user'
  description?: string;
  permissions: string[]; // ví dụ: ['user:create', 'user:read', 'user:update']
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
    permissions: {
      type: [String],
      default: [],
    },
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
