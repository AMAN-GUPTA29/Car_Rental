
/**
 * @import {SQS} for sending the bids to sqs amazon 
 */
import {SQS} from "@aws-sdk/client-sqs"
import awsSQSProducer from "../../utils/awsSQSproducerutil.js";
import { validateBidding } from "../../utils/validators/biddingDetails.validate.js";


/**
 * 
 * @param {*} req 
 * @param {*} res
 * @returns sends the incoming bidding to aws queue instead of directly saving to db 
 */
const consumerBiddingController = async (req, res) => {
    try {

        const { error } = validateBidding(req.body);
        if (error) {
        console.log(error)
        return res.status(400).json({ error: error, message: "Validation failed" });
        }
        console.log("Bidding data received:", req.body);

        /**
         * defining the params of the sqs
         */
        const params = {
            MessageBody: JSON.stringify({...req.body}),
            QueueUrl: process.env.QUEUE_URL
        };

        /**
         * sending the message to sqs
         */
        // const data = await sqs.sendMessage(params);
        const rep=awsSQSProducer(params);
        
        console.log(req.body);
        res.status(201).send({ rep });

    } catch (error) {
        console.error("Error during bidding:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export { consumerBiddingController };