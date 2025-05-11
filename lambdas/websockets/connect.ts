import { _200, _500 } from '../aws_components/responses';
import Dynamo from '../aws_components/dynamoDB';

const userTable = process.env.userTable || '';
const locationTable = process.env.locationTable || '';

interface ConnectionData {
    ID: string;
    timeStamp: number;
    messages?: any[];
    domainName: string;
    stage: string;
}

interface LocationData extends ConnectionData {
    longitude: number;
    latitude: number;
}

export const handler = async (event: any) => {
    console.log('event:', event);

    const { connectionId: connectionID, domainName, stage } = event.requestContext;
    
    const dataMessage: ConnectionData = {
        // we want the token and geodata here then
        ID: connectionID,
        timeStamp: Date.now(),
        messages: [],
        domainName,
        stage,
    }

    const dataLocation: LocationData = {
        // we want the token and geodata here then
        ID: connectionID,
        timeStamp: Date.now(),
        longitude: 0,
        latitude: 0,
        domainName,
        stage,
    }

    try {
        await Dynamo.write(dataMessage, userTable);
        await Dynamo.write(dataLocation, locationTable);

        return _200({ message: 'Connection established' });
    } catch (error) {
        console.error('Error in connect handler:', error);
        return _500({ 
            message: 'Internal server error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};
