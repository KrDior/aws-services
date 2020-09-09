import "source-map-support/register";
import * as AWS from "aws-sdk";

const sns = new AWS.SNS({region: 'eu-central-1'});

// admin email
const email = 'xzx89s@gmail.com';

export const s3handler = async (event) => {
  try {
    console.log("s3handler bucket trigger data", event.Records[0]);
    const message = event.Records[0].s3;

    const s3 = new AWS.S3();
    const params = {
      Bucket: "execution-s3-bucket",
      Key: message.object.key,
    };

    await s3.getObject(params)
    .promise()
    .then(async (data) => {
      const message = JSON.parse(data.Body.toString());
      const params = {
        Message: JSON.stringify(message),
        TopicArn: "arn:aws:sns:eu-central-1:307905271295:ProductTopic",
      };

      console.log("publish topic", message);

      await sns.publish(params)
      .promise()
      .then(async (data) => {
        console.log('SNS publish success', data);
        const params = {
          Protocol: 'EMAIL',
          TopicArn: "arn:aws:sns:eu-central-1:307905271295:ProductTopic",
          Endpoint: email
        };

        console.log("trigger email notification", params);

        await sns.subscribe(params)
        .promise()
        .then(data => {
          console.log('Email notification success', data);
        })
        .catch(err => console.log('Email notification fail', err));
      })
      .catch(err => console.log('SNS publish fail', err));
    })
    .catch(err => console.log('S3 bucket fail', err));

  } catch (err) {
    console.log(err);
  }
};
