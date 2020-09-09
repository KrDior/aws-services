import * as AWS from "aws-sdk";

export interface IOrder {
    id: string;
    itemsData: Array<Item> | Item;
    userInfo: any;
    order: Array<Item> | Item;
    headers: any;
    crossdomain: boolean;
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

AWS.config.update({
    region: "eu-central-1",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function getItems() {
    const params: Params = {
        TableName: "products",
    };

    return dynamoDB
        .scan(params)
        .promise()
        .then((data) => data.Items)
        .catch((err) => console.log(err));
}

export function createItem(data) {
    try {
        // const item = JSON.parse(data.Records[0].body);
        let item;
        console.log('data records', data.Records);
        data.Records.forEach(element => {
            console.log('data element', element);
            if (element.body) {
                console.log('element data body', element.body)
                item = JSON.parse(element.body);
            }
        });

        const params: ParamsWithItem = {
            TableName: "products",
            Item: {
                id: item.id,
                title: item.title,
                tagline: item.tagline,
                vote_average: item.vote_average,
                vote_count: item.vote_count,
                release_date: item.release_date,
                poster_path: item.poster_path,
                overview: item.overview,
                budget: item.budget,
                revenue: item.revenue,
                genres: item.genres,
                runtime: item.runtime,
                availability: item.availability,
                price: item.price,
            },
        };
        console.log("CreateItem function invocation with data", params);
        return dynamoDB
            .put(params)
            .promise()
            .then((data) => console.log("dynamoDB success operation", data))
            .catch((err) => console.log("dynamoDB fail operation", err));
    } catch (err) {
        console.log(err);
    }
}

export function updateItem(data) {
    const item = JSON.parse(data);
    const params: ParamsWithKey = {
        TableName: "products",
        Key: {
            id: item.id,
        },
        UpdateExpression:
            "set itemsData = :d, customerInfo = :i, totalCost = :c, orderStatus = :o",
        ExpressionAttributeValues: {
            ":d": item.itemsData,
            ":i": item.customerInfo,
            ":c": item.totalCost,
            ":o": item.orderStatus,
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
        TableName: "products",
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
