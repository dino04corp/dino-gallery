import { Permission } from '../models';

const defaultPermissions = [
    {
        name: 'user:create',
        description: 'Tạo người dùng',
        group: 'user',
        isSystemPermission: true,
    },
    {
        name: 'user:read',
        description: 'Xem người dùng',
        group: 'user',
        isSystemPermission: true,
    },
    {
        name: 'user:update',
        description: 'Cập nhật người dùng',
        group: 'user',
        isSystemPermission: true,
    },
    {
        name: 'user:delete',
        description: 'Xóa người dùng',
        group: 'user',
        isSystemPermission: true,
    },
    {
        name: 'role:read',
        description: 'Xem quyền',
        group: 'role',
        isSystemPermission: true,
    },
    {
        name: 'role:update',
        description: 'Cập nhật quyền',
        group: 'role',
        isSystemPermission: true,
    },
];

export async function seedPermissions() {
    for (const perm of defaultPermissions) {
        const exists = await Permission.findOne({ name: perm.name });
        if (!exists) {
            await Permission.create(perm);
            console.log(`✅ Created permission: ${perm.name}`);
        } else {
            console.log(`ℹ️  Permission exists: ${perm.name}`);
        }
    }
}
