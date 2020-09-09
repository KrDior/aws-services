import "source-map-support/register";
import {
    createItem,
} from './service/db-client';

export const upload = async (event) => {
    try {
        console.log('Lambda invocation with event', event);
        await createItem(event);
    } catch (err) {
        return err;
    }
};
