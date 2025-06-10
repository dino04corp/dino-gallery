import { seedPermissions } from './permissions.seed';
import { seedRoles } from './roles.seed';
import { seedSuperAdmin } from './superadmin.seed';

async function seed() {
    await seedPermissions();
    await seedRoles();
    await seedSuperAdmin();

    console.log('✅ Seeding complete');
}

export default seed;
