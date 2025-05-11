import AWS from 'aws-sdk';
import { DynamoItem } from '../../types/dynamodb';

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(ID: string, TableName: string): Promise<DynamoItem> {
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
            const item = data.Item as DynamoItem;
            if (!item.ID) {
                throw Error(`Retrieved item does not have an ID for ${ID} from ${TableName}`);
            }
            console.log(data);
            return item;
        } catch (error) {
            console.error(`Error fetching item ${ID} from ${TableName}:`, error);
            throw error;
        }
    },

    async write(data: DynamoItem, TableName: string): Promise<void> {
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
        } catch (error) {
            console.error(`Error writing item to ${TableName}:`, error);
            throw error;
        }
    },
    async delete(ID: string, TableName: string) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };
        return documentClient.delete(params).promise();

    }
};

export default Dynamo;
