import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import {
	createItem,
	deleteItem,
	getItems,
	updateItem
} from './service/db-client';

export const orders: APIGatewayProxyHandler = async () => {
	try {
		const orders = await getItems();
		return {
			statusCode: 200,
			headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
			body: JSON.stringify(orders)
		};
	} catch (err) {
		return {
			statusCode: 400,
			body: JSON.stringify(err)
		};
	}
}

export const createOrder: APIGatewayProxyHandler = async (event) => {
	try {
		await createItem(event.body);
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
			body: JSON.stringify(err)
		};
	}
}

export const updateOrder: APIGatewayProxyHandler = async (event) => {
	try {
		await updateItem(event.body);
		return {
			statusCode: 200,
			headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
			body: 'Item was successfully updated!'
		};
	} catch (err) {
		return {
			statusCode: 400,
			headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
			body: JSON.stringify(err)
		};
	}
}

export const deleteOrder: APIGatewayProxyHandler = async (event) => {
	try {
		await deleteItem(event.body);
		return {
			statusCode: 200,
			headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
			body: 'Item was deleted!'
		};
	} catch (err) {
		return {
			statusCode: 400,
			body: JSON.stringify(err)
		};
	}
}
