"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3Client = new aws_sdk_1.default.S3();
const S3 = {
    async get(fileName, bucket) {
        const params = {
            Bucket: bucket,
            Key: fileName,
        };
        const response = await s3Client.getObject(params).promise();
        if (!response || !response.Body) {
            throw Error(`Failed to get file ${fileName}, from ${bucket}. Response or Body is undefined.`);
        }
        // If it's a JSON file, parse the body
        if (fileName.slice(fileName.length - 4, fileName.length) === 'json') {
            response.Body = JSON.parse(response.Body.toString());
        }
        return response;
    },
    async write(data, fileName, bucket) {
        const params = {
            Bucket: bucket,
            Body: JSON.stringify(data),
            Key: fileName,
        };
        try {
            const newData = await s3Client.putObject(params).promise();
            return newData;
        }
        catch (error) {
            console.error(`Failed to write file ${fileName} to bucket ${bucket}:`, error);
            throw new Error(`Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
};
exports.default = S3;
//# sourceMappingURL=s3Bucket.js.map