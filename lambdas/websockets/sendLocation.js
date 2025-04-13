const responses = require('../aws_components/responses');
const Dynamo = require('../aws_components/dynamoDB');
const WebSocket = require('../aws_components/websocketMessage');
const locationTable = process.env.locationTable;

exports.handler = async event => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    const body = JSON.parse(event.body);

    try {
        const longitude = body.longitude;
        const latitude = body.latitude;
        console.log('longitude:', longitude);
        if (!longitude || !latitude) {
            return responses._400({ message: 'Longitude and latitude are required' });
        }

        const record = await Dynamo.get(connectionID, locationTable);
        const { domainName, stage } = record;
        // Update the record with the new location
        const data = {
            ...record,
            longitude: longitude,
            latitude: latitude,
            timeStamp: Date.now(),
        };
        await Dynamo.write(data, locationTable);

        // Send a confirmation message back to the client
        await WebSocket.send({
            domainName,
            stage,
            connectionID,
            message: 'Location updated successfully',
        });

        return responses._200({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        return responses._400({ message: 'Failed to update location' });
    }
};