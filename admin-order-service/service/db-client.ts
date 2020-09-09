import * as AWS from "aws-sdk";

export interface IOrder {
    id: string;
    itemsData: Array<Item> | Item;
    userInfo: any,
    order: Array<Item> | Item,
    headers: any,
    crossdomain: boolean
    orderStatus: string;
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

interface Params {
    TableName: string;
    Limit?: number;
    ProjectionExpression?: string;
    ExpressionAttributeValues?: any;
    UpdateExpression?: string;
    FilterExpression?: string;
}

interface ParamsWithKey extends Params {
    Key: {
        id: string;
    };
}

interface ParamsWithItem extends Params {
    Item: Item;
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function getItems() {
    const params: Params = {
        TableName: "orders",
    };

    return dynamoDB
        .scan(params)
        .promise()
        .then((data) => data.Items)
        .catch((err) => console.log(err));
}

export function createItem(data) {
    const params: ParamsWithItem = {
        TableName: "orders",
        Item: JSON.parse(data),
    };
    console.log('dynamoDB invocation with params', params);
    return dynamoDB
        .put(params)
        .promise()
        .then((result) => result)
        .catch((err) => console.log(err));
}

export function updateItem(data) {
    const item = JSON.parse(data);

    const params: ParamsWithKey = {
        TableName: "orders",
        Key: {
            id: item.id,
        },
        UpdateExpression: "set itemsData = :d, customerInfo = :i, totalCost = :c, orderStatus = :o",
        ExpressionAttributeValues: {
            ":d": item.itemsData,
            ":i": item.customerInfo,
            ":c": item.totalCost,
            ":o": item.orderStatus
        },
    };

    return dynamoDB
        .update(params)
        .promise()
        .then((result) => result)
        .catch((err) => console.log(err));
}

export function deleteItem(data) {
    const item = JSON.parse(data);
    const params: ParamsWithKey = {
        TableName: "orders",
        Key: {
            id: item.id,
        },
    };

    return dynamoDB
        .delete(params)
        .promise()
        .then((result) => result)
        .catch((err) => console.log(err));
}
