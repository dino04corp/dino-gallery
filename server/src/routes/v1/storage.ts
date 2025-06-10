import { Router } from 'express';
import { storage } from '../../controller';

const route = Router();

route.route('/').post(storage.create).get(storage.read);
route
    .route('/:storage_id')
    .get(storage.readById)
    .put(storage.update)
    .delete(storage.delete);
route.route('/:cloud_storage/ping').post(storage.ping);

export default route;
