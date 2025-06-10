import path from 'path';

export const localData = path.join(
    path.dirname(__dirname),
    'server',
    'localData'
);

export const localMetadata = path.join(
    path.dirname(__dirname),
    'server',
    'localMetadata',
    'data.json'
);

export const StorageDB = path.join(localData, 'storage.json');
export const ResourceDB = path.join(localData, 'resource.json');
