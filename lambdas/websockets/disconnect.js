const responses = require('../common/responses');
const Dynamo = require('../common/Dynamo');
const tableName = process.env.tableName;
exports.handler = async event => {

    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    await Dynamo.delete(connectionID, tableName);

    return responses._200({ message: 'disconnected' });
}