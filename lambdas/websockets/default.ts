import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { _200 } from '../aws_components/responses';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('event:', event);
    
    return _200({ message: 'default' });
};
