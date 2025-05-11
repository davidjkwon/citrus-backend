import { APIGatewayProxyResult } from 'aws-lambda';

export const _200 = (data: any = {}): APIGatewayProxyResult => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

export const _400 = (data: any = {}): APIGatewayProxyResult => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: 400,
        body: JSON.stringify(data),
    };
};

export const _500 = (data: any = {}): APIGatewayProxyResult => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: 500,
        body: JSON.stringify(data),
    };
};
