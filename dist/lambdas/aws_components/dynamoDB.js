"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const documentClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
const Dynamo = {
    async get(ID, TableName) {
        const params = {
            TableName,
            Key: { ID },
        };
        try {
            const data = await documentClient.get(params).promise();
            if (!data || !data.Item) {
                throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
            }
            // Explicitly assert ID is present
            const item = data.Item;
            if (!item.ID) {
                throw Error(`Retrieved item does not have an ID for ${ID} from ${TableName}`);
            }
            console.log(data);
            return item;
        }
        catch (error) {
            console.error(`Error fetching item ${ID} from ${TableName}:`, error);
            throw error;
        }
    },
    async write(data, TableName) {
        if (!data.ID) {
            throw Error('no ID on the data');
        }
        const params = {
            TableName,
            Item: data,
        };
        try {
            await documentClient.put(params).promise();
            console.log(`Successfully wrote item ${data.ID} to ${TableName}`);
        }
        catch (error) {
            console.error(`Error writing item to ${TableName}:`, error);
            throw error;
        }
    },
    async delete(ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };
        return documentClient.delete(params).promise();
    }
};
exports.default = Dynamo;
//# sourceMappingURL=dynamoDB.js.map