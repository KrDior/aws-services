import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import {
  getItems,
  getItemById,
  getItemsByTitle,
  getItemsByGenre,
} from "./service/db-client";

interface ResponseData {
  Items?: Array<Item>;
  Count?: number;
  ScannedCount?: number;
  LastEvaluatedKey?: {
    id?: string;
  };
  dbSize?: number;
}

interface Item {
  id: string;
  title: string;
  release_date: string;
  poster_path: string;
  genres: Array<string>;
  vote_count: string;
  tagline: string;
  vote_average: string;
  overview: string;
  budget: string;
  revenue: string;
  runtime: string;
  availability: boolean;
  price: string;
}

export const products: APIGatewayProxyHandler = async (event) => {
  const startPosition = event?.queryStringParameters?.startPosition || "0";
  const itemCount = event?.queryStringParameters?.itemCount || "10";

  try {
    const products: ResponseData = await getItems(startPosition, itemCount);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

export const productId: APIGatewayProxyHandler = async (event) => {
  try {
    const product: ResponseData = await getItemById(
      event.queryStringParameters.id
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(product),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

export const productsTitle: APIGatewayProxyHandler = async (event) => {
  try {
    const products: ResponseData = await getItemsByTitle(
      event.queryStringParameters.title
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

export const productsGenre: APIGatewayProxyHandler = async (event) => {
  try {
    const products: ResponseData = await getItemsByGenre(
      event.queryStringParameters.genre
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};

export const updateProduct: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda invocation with event', event);
  const sqs = new AWS.SQS();
  const sqsUrl = 'https://sqs.eu-central-1.amazonaws.com/307905271295/product-update-sqs';
  try {
    const message = {
      MessageBody: event.body,
      QueueUrl: sqsUrl,
    };
    console.log('Message will be publish to SQS', message);
    await sqs.sendMessage(message)
      .promise()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify('Product(s) was added to SQS'),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};
