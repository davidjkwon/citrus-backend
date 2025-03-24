const responses = require('../common/responses');
const responses = require('../common/responses');
const Dynamo = require('../common/Dynamo');
const tableName = process.env.tableName;
exports.handler = async event => {

    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;

    const body = JSON.parse(event.body);

    try {
        const record = await Dynamo.get(connectionID, tableName);
        const messages = record.messages;

        messages.push(body.message);

        const data = {
            ...record,
            messages
        }
        await Dynamo.write(data, tableName);
        return responses._200({ message: 'got a message' });

    } catch (error) {
        return responses._400({ message: 'no message' });
        
    }
}