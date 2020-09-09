const AWS = require("aws-sdk");
AWS.config.update({region: 'eu-central-1'});
const sqs = new AWS.SQS();

function updateProductsCount(count) {
  const sqsUrl = 'https://sqs.eu-central-1.amazonaws.com/307905271295/product-update-sqs';
  const data = {
    "availability": true,
    "budget": "0",
    "genres": [
      "Action",
      "Comedy",
      "Science Fiction"
    ],
    "id": "11111111111111111",
    "overview": "Jackie Chan stars as a hardened special forces agent who fights to protect a young woman from a sinister criminal gang. At the same time he with feels a special connection to the young woman, like they met in a different life.",
    "poster_path": "https://image.tmdb.org/t/p/w500/x8kbeiqXFJc5RIAShyZMYAv8VCq.jpg",
    "price": "30",
    "release_date": "2017-12-22",
    "revenue": "0",
    "runtime": null,
    "tagline": "",
    "title": "Bleeding Steel",
    "vote_average": "6.2",
    "vote_count": "24"
  };
	const message = {
        MessageBody: JSON.stringify(data),
        QueueUrl: sqsUrl,
    };

    return sqs.sendMessage(message)
        .promise()
        .then(data => console.log(data))
        .catch(err => console.log(err));
}
updateProductsCount('test')
