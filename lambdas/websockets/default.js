const responses = require('../common/responses');
exports.handler = async event => {

    console.log('event:', event);
    
    return responses._200({ message: 'default' });
}