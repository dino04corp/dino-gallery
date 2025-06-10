import { seedPermissions } from './permissions.seed';
import { seedRoles } from './roles.seed';

async function seed() {
    await seedPermissions();
    await seedRoles();

    console.log('✅ Seeding complete');
}

export default seed;
