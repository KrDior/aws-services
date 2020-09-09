import * as AWS from "aws-sdk";
import { ScanOutput } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

interface Params {
    TableName: string,
    Limit?: number,
    ProjectionExpression?: string,
    ExpressionAttributeValues?: any,
    FilterExpression?: string,
}

interface ParamsWithKey extends Params {
    Key: {
        id: string
    }
}

interface DataResponse extends PromiseResult<ScanOutput, AWSError>{
    Items?: Array<any>;
    Count?: number;
    ScannedCount?: number;
    dbSize?: number;
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();
let dbSize;

export async function getItems(startPosition: string, itemCount: string) {
    const params: Params = {
        TableName: "products",
    };

    if (!dbSize) {
        dbSize = await getItemCount(params, startPosition, itemCount);
    } else {
        params.Limit = startPosition ? +startPosition + (+itemCount) : +itemCount;

        return dynamoDB
            .scan(params)
            .promise()
            .then((data: DataResponse) => {
                if (data.Items.length) {
                    data.Items = data.Items.slice(+startPosition);
                    data.dbSize = dbSize;
                }
                return data;
            })
            .catch((err) => err);
    }
}

function getItemCount(params, startPosition, itemCount) {
    return dynamoDB
    .scan(params)
    .promise()
    .then((data: DataResponse) => {
        getItems(startPosition, itemCount)
        return data.Items.length;
    })
    .catch((err: DataResponse) => err);
}

export function getItemById(id: string) {
    const params: ParamsWithKey = {
        TableName: "products",
        Key: {
            id
        },
    };

    return dynamoDB
        .get(params)
        .promise()
        .then((data: DataResponse) => data)
        .catch((err: DataResponse) => err);
}

export function getItemsByTitle(title: string) {
    const params: Params = {
        TableName: "products",
        ProjectionExpression: `id, title, tagline, vote_average, vote_count, release_date,
        poster_path, overview, budget, revenue, genres, runtime, availability, price`,
        ExpressionAttributeValues: {
            ':topic': title
        },
        FilterExpression: 'contains (title, :topic)',
    };

    return dynamoDB
        .scan(params)
        .promise()
        .then((data: DataResponse) => data)
        .catch((err: DataResponse) => err);
}

export function getItemsByGenre(genre: string) {
    const params: Params = {
        TableName: "products",
        ProjectionExpression: `id, title, tagline, vote_average, vote_count, release_date,
        poster_path, overview, budget, revenue, genres, runtime, availability, price`,
        ExpressionAttributeValues: {
            ':gnr': genre
        },
        FilterExpression: 'contains (genres, :gnr)',
    };

    return dynamoDB
        .scan(params)
        .promise()
        .then((data: DataResponse) => data)
        .catch((err: DataResponse) => err);
}
