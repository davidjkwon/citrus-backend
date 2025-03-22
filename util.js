const mongoose = require('mongoose');

async function deleteDocument(model, query) {
    try {
        // get jwt or cid, authenticate first
        const result = await model.findOneAndDelete(query);
        if (!result) {
            throw new Error('Document not found');
        }
        return result;
    } catch (error) {
        throw new Error(`Error deleting document: ${error.message}`);
    }
}

module.exports = {
    deleteDocument
};