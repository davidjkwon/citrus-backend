import mongoose, { Model } from 'mongoose';

async function deleteDocument<T>(model: Model<T>, query: object) {
    try {
        // get jwt or cid, authenticate first
        const result = await model.findOneAndDelete(query);
        if (!result) {
            throw new Error('Document not found');
        }
        return result;
    } catch (error: any) {
        throw new Error(`Error deleting document: ${error.message}`);
    }
}

export { deleteDocument };
