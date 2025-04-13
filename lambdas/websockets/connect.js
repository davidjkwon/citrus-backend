const responses = require('../aws_components/responses');
const Dynamo = require('../aws_components/dynamoDB');
const userTable = process.env.userTable;
const locationTable = process.env.locationTable;

exports.handler = async event => {

    console.log('event:', event);

    const { connectionId: connectionID, domainName, stage } = event.requestContext;
    
    const dataMessage = {
        // we want the tocken and geodata here then
        ID: connectionID,
        timeStamp: Date.now(),
        messages: [],
        domainName,
        stage,
    }

    const dataLocation = {
        // we want the tocken and geodata here then
        ID: connectionID,
        timeStamp: Date.now(),
        longitude: 0,
        latitude: 0,
        domainName,
        stage,
    }

    await Dynamo.write(dataMessage, userTable)
    await Dynamo.write(dataLocation, locationTable)
    return responses._200({ message: 'connected' });
}