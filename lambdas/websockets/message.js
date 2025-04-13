const responses = require('../aws_components/responses');
const Dynamo = require('../aws_components/dynamoDB');
const WebSocket = require('../aws_components/websocketMessage');
const userTable = process.env.userTable;

exports.handler = async event => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;

    const body = JSON.parse(event.body);

    try {
        const record = await Dynamo.get(connectionID, userTable);
        const { messages, domainName, stage } = record;

        messages.push(body.message);

        const data = {
            ...record,
            messages: [body.message],
        };
        await Dynamo.write(data, userTable);

        console.log('Sending WebSocket message...');
        console.log('connectionID:', connectionID);
        console.log('domainName:', domainName);
        console.log('stage:', stage);

        await WebSocket.send({ domainName, stage, connectionID, message: "This is a reply" });
        console.log('Message sent successfully');

        return responses._200({ message: 'got a message' });
    } catch (error) {
        console.error('Error:', error);
        return responses._400({ message: 'no message' });
    }
};