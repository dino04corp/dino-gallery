import * as admin from 'firebase-admin';

// tslint:disable-next-line:no-var-requires
const key = require('../keys/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL:
        'https://gallery-h2m9-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

const db: FirebaseFirestore.Firestore = admin.firestore();
db.settings({ timestampsInSnapshots: true });
const auth = admin.auth();

export default { db, auth };
