export const checkUserAuth = (event, context, callback) => {
  console.log('Invoke checkUserAuth', event)

  try {
    const body = {
      message: 'Successs - Profile Retrieved!',
      authStatus: event?.requestContext?.authorizer?.authStatus,
    };
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(body),
  };
    // Return response
    console.log(response);
    callback(null, response);
  } catch (e) {
    console.log(`Error logging in: ${e.message}`);
    const response = { // Error response
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        error: e.message,
      }),
    };
    callback(null, response);
  }
};
