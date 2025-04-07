
/**
 * @import {SQS} for sending the bids to sqs amazon 
 */
import {SQS} from "@aws-sdk/client-sqs"


async function awsSQSProducer(params) {
    try {

        /**
         * defining properties to sqs 
         */
        const sqs = new SQS({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });


        /**
         * defining the params of the sqs
         */
        // const params = {
        //     MessageBody: JSON.stringify({...req.body}),
        //     QueueUrl: process.env.QUEUE_URL
        // };

        /**
         * sending the message to sqs
         */
        const data = await sqs.sendMessage(params);

        return ("success");

        // console.log(req.body);
        // res.status(201).send({ data });

    } catch (error) {
        console.error("Error during bidding:", error.message);
        // res.status(500).json({ error: "Internal server error" });
        return ("error")
    }



}


export default awsSQSProducer;

