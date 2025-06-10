import { User, Role } from '../models'; // đảm bảo đúng path
import bcrypt from 'bcrypt';

export async function seedSuperAdmin() {
    const email = 'admin@gmail.com';

    const exists = await User.findOne({ email });
    if (exists) {
        console.log(`ℹ️  Superadmin user exists: ${email}`);
        return;
    }

    const role = await Role.findOne({ name: 'superadmin' });
    if (!role) {
        console.error('❌ Superadmin role not found. Run seedRoles() first.');
        return;
    }

    const password = 'supersecurepassword'; // bạn có thể load từ ENV nếu cần
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name: 'Super Admin',
        username: 'superadmin',
        email,
        password: hashedPassword,
        roleId: role._id,
        isActive: true,
    });

    await user.save();
    console.log(`✅ Created superadmin user: ${email}`);
}
