/**
 * @import Bidding schema for database operations
 * @import SQS client from AWS SDK
 */
import Bidding from "../models/bookings/booking.schema.js";
import { SQS } from "@aws-sdk/client-sqs";

/**
 * @description Consumes messages from AWS SQS queue and processes bidding data
 * @returns {Promise<void>} - Processes SQS messages and saves to database
 */
async function awsSQSConsumer() {
  /**
   * @type {SQS}
   * @description Initialize SQS client with AWS credentials
   */
  const sqs = new SQS({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    /**
     * @type {Object}
     * @description Receive message from SQS queue with long polling
     */
    const { Messages } = await sqs.receiveMessage({
      QueueUrl: process.env.QUEUE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    });

    /**
     * @description Return early if no messages are available
     */

    if (!Messages) return;

    /**
     * @description Log and parse the message body
     */

    console.log(JSON.parse(Messages[0].Body));
    /**
     * @type {Object}
     * @description Parse bid data from message
     */
    const bid = JSON.parse(Messages[0].Body);

    /**
     * @description Save bid data to database
     */
    await new Bidding({
      ...bid,
    }).save();

    /**
     * @type {Object}
     * @description Parameters for deleting the processed message
     */
    var deleteParams = {
      QueueUrl: process.env.QUEUE_URL,
      ReceiptHandle: Messages[0].ReceiptHandle,
    };

    /**
     * @description Delete the message from the queue after processing
     */
    await sqs.deleteMessage(deleteParams);
  } catch (error) {
    /**
     * @description Log any errors that occur during processing
     */
    console.error("Error", error);
  }
}

export default awsSQSConsumer;
