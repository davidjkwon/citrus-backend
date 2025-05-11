import AWS from 'aws-sdk';

interface WebsocketMessageParams {
    domainName: string;
    stage: string;
    connectionID: string;
    message: string;
}

const create = (domainName: string, stage: string): AWS.ApiGatewayManagementApi => {
    const endpoint = `${domainName}/${stage}`;
    return new AWS.ApiGatewayManagementApi({
        apiVersion: '2025-04-06',
        endpoint,
    });
}

const send = async ({ domainName, stage, connectionID, message }: WebsocketMessageParams): Promise<void> => {
    const ws = create(domainName, stage);

    const postParams = {
        Data: message,
        ConnectionId: connectionID,
    }

    try {
        await ws.postToConnection(postParams).promise();
    } catch (error: unknown) {
        // Log the error or handle specific AWS SDK error cases
        if (error instanceof Error && error.name === 'GoneException') {
            // Connection is no longer available
            console.log(`Connection ${connectionID} is no longer active`);
        } else {
            // Rethrow other errors
            throw error;
        }
    }
};

export default { send };
