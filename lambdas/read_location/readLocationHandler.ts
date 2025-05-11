import Responses from "../aws_components/responses";
import Dynamo from "../aws_components/dynamoDB";
import WebSocket from "../aws_components/websocketMessage";

const locationTable = process.env.locationTable || '';

interface LocationRecord {
    domainName: string;
    stage: string;
    longitude?: number;
    latitude?: number;
    timeStamp?: number;
    [key: string]: any;
}

interface LocationBody {
    longitude: number;
    latitude: number;
}

export const handler = async (event: any) => {
    console.log("event:", event);
    const { connectionId: connectionID } = event.requestContext;
    const body: LocationBody = JSON.parse(event.body);

    try {
        const { longitude, latitude } = body;
        console.log("longitude:", longitude);
        if (!longitude || !latitude) {
            return Responses._400({ message: "Longitude and latitude are required" });
        }

        const record = await Dynamo.get(connectionID, locationTable) as LocationRecord;
        const { domainName, stage } = record;
        
        // Update the record with the new location
        const data: LocationRecord = {
            ...record,
            longitude,
            latitude,
            timeStamp: Date.now(),
        };
        await Dynamo.write(data, locationTable);

        // Send a confirmation message back to the client
        await WebSocket.send({
            domainName,
            stage,
            connectionID,
            message: JSON.stringify({ 
                status: 'success', 
                message: 'Location updated successfully' 
            }),
        });

        return Responses._200({ message: 'Location updated' });
    } catch (error) {
        console.error('Error in readLocationHandler:', error);
        return Responses._500({ 
            message: 'Internal server error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};
