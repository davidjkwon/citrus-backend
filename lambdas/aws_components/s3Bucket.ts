import AWS from 'aws-sdk';

const s3Client = new AWS.S3();

interface S3Params {
    Bucket: string;
    Key: string;
    Body?: string;
}

const S3 = {
    async get(fileName: string, bucket: string): Promise<AWS.S3.GetObjectOutput> {
        const params: S3Params = {
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

    async write(data: any, fileName: string, bucket: string): Promise<AWS.S3.PutObjectOutput> {
        const params: S3Params = {
            Bucket: bucket,
            Body: JSON.stringify(data),
            Key: fileName,
        };

        try {
            const newData = await s3Client.putObject(params).promise();
            return newData;
        } catch (error) {
            console.error(`Failed to write file ${fileName} to bucket ${bucket}:`, error);
            throw new Error(`Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
};

export default S3;
