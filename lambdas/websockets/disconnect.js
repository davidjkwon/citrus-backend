const responses = require('../aws_components/responses');
const Dynamo = require('../aws_components/dynamoDB');
const userTable = process.env.userTable;
const locationTable = process.env.locationTable;
exports.handler = async event => {

    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    await Dynamo.delete(connectionID, userTable);
    await Dynamo.delete(connectionID, locationTable);

    return responses._200({ message: 'disconnected' });
}