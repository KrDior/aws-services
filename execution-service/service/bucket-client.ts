import * as AWS from "aws-sdk";

export async function pushItemToBucket(params) {
	const s3 = new AWS.S3();
	console.log('S3 bucket function invoketion', params);

	await s3.putObject(params)
		.promise()
		.then(data => console.log('S3 bucket writing success', data))
		.catch(err => console.log('S3 bucket fail', err))
}
