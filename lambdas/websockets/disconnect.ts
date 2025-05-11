import { APIGatewayProxyEvent } from 'aws-lambda';
import { _200, _500 } from '../aws_components/responses';
import Dynamo from '../aws_components/dynamoDB';

const userTable = process.env.userTable as string;
const locationTable = process.env.locationTable as string;

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    if (!connectionID) {
        return _500({ message: 'No connection ID' });
    }
    await Dynamo.delete(connectionID, userTable);
    await Dynamo.delete(connectionID, locationTable);

    return _200({ message: 'disconnected' });
};
