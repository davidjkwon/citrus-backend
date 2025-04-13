const responses = require('../aws_components/responses');
const Dynamo = require('../aws_components/dynamoDB');
exports.handler = async event => {

    console.log('event:', event);
    
    return responses._200({ message: 'default' });
}