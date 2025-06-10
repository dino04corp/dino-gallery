import { Role, Permission } from '../models';

const rolesToCreate = [
    {
        name: 'superadmin',
        description: 'Toàn quyền hệ thống',
        permissionGroups: ['user', 'role', 'permission'],
        isSystemRole: true,
    },
];

export async function seedRoles() {
    for (const roleData of rolesToCreate) {
        const exists = await Role.findOne({ name: roleData.name });
        if (exists) {
            console.log(`ℹ️  Role exists: ${roleData.name}`);
            continue;
        }

        const permissions = await Permission.find({
            group: { $in: roleData.permissionGroups },
        });

        const role = new Role({
            name: roleData.name,
            description: roleData.description,
            permissions: permissions.map((p) => p._id),
            isSystemRole: roleData.isSystemRole,
        });

        await role.save();
        console.log(`✅ Created role: ${roleData.name}`);
    }
}
