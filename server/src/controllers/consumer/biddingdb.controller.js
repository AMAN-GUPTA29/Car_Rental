import Bidding from "../../models/bookings/booking.schema.js";
import {SQS} from "@aws-sdk/client-sqs"


  async function awsSQSConsumer () {
        const sqs = new SQS({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        
            try {
               
                const {Messages} = await sqs.receiveMessage({
                    QueueUrl: process.env.QUEUE_URL,
                    MaxNumberOfMessages: 1,
                    WaitTimeSeconds: 20 
                });
    
                
                if (!Messages) return;
    
                
                console.log(JSON.parse(Messages[0].Body));
                const bid=(JSON.parse(Messages[0].Body));
                await new Bidding({
                ...bid
                }).save();

                var deleteParams = {
                    QueueUrl: process.env.QUEUE_URL,
                    ReceiptHandle: Messages[0].ReceiptHandle,
                  };

                await sqs.deleteMessage(deleteParams);
                  
            } catch (error) {
                
                console.error('Error', error);
            }
        
   
}

export default awsSQSConsumer ;