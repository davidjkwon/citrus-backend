import { APIGatewayProxyEvent } from 'aws-lambda';
import { _200, _400, _500 } from '../aws_components/responses';
import Dynamo from '../aws_components/dynamoDB';
import WebSocket from '../aws_components/websocketMessage';
import { DynamoItem, LocationItem } from '../../types/dynamodb';
import { MessageBody } from '../../types/websocket';

const userTable = process.env.userTable as string;

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    if (!connectionID) {
        return _500({ message: 'No connection ID' });
    }
    const body: MessageBody = JSON.parse(event.body || '{}');

    try {
        const record: LocationItem = await Dynamo.get(connectionID, userTable);
        const { messages, domainName, stage } = record;

        messages.push(body.message);

        const data: DynamoItem = {
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

        return _200({ message: 'got a message' });
    } catch (error) {
        console.error('Error:', error);
        return _400({ message: 'no message' });
    }
};
