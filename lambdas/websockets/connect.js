const responses = require('../common/responses');
const Dynamo = require('../common/Dynamo');
const tableName = process.env.tableName;

exports.handler = async event => {

    console.log('event:', event);

    const { connectionId: connectionID } = event.requestContext;
    
    const data = {
        // we want the tocken and geodata here then
        ID: connectionID,
        date: Date.now(),
        messages: []
    }

    await Dynamo.write(data, tableName)
    return responses._200({ message: 'connected' });
}