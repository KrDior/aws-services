import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import { pushItemToBucket } from "./service/bucket-client";

export const uploadBucket: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    Bucket: "execution-s3-bucket",
    Key: data.id.S || data.id,
    Body: JSON.stringify(data),
  };
  try {
    console.log('pushItemToBucket function invoketion', params);
    await pushItemToBucket(params);
    return {
			statusCode: 200,
			headers: {
        'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
      },
			body: 'Item was successfully created!'
		};
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

export const listingBucket = async () => {
  const S3 = new AWS.S3();
  const params = {
    Bucket: "execution-s3-bucket",
  };
  try {
    await S3.listObjects(params, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data.Contents); // successful response
      }
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "S3 bucket listing",
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

export const clearBucket = async (event) => {
  const objKey = event.body.key;
  const S3 = new AWS.S3();
  const params = {
    Bucket: "execution-s3-bucket",
    Key: objKey

  };
  try {
    await S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log("Error", err); // an error occurred
      } else {
        console.log("Success", data); // successful response
      }
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "S3 bucket item was deleted",
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};
