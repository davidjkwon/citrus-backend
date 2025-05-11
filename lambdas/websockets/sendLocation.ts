import { APIGatewayProxyEvent } from 'aws-lambda';
import { _200, _400, _500 } from '../aws_components/responses';
import Dynamo from '../aws_components/dynamoDB';
import WebSocket from '../aws_components/websocketMessage';
import { DynamoItem } from '../../types';

const locationTable = process.env.locationTable as string;

interface LocationBody {
    longitude: number;
    latitude: number;
}

interface LocationRecord {
    domainName: string;
    stage: string;
    connectionId?: string;
    longitude?: number;
    latitude?: number;
    timeStamp?: number;
}

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    if (!connectionID) {
        return _500({ message: 'No connection ID' });
    }
    const body: LocationBody = JSON.parse(event.body || '{}');

    try {
        const { longitude, latitude } = body;
        console.log('longitude:', longitude);
        if (!longitude || !latitude) {
            return _400({ message: 'Longitude and latitude are required' });
        }

        const record: DynamoItem = await Dynamo.get(connectionID, locationTable);
        const { domainName, stage } = record;

        // Update the record with the new location
        const data: DynamoItem = {
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

        return _200({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        return _400({ message: 'Failed to update location' });
    }
};
