// Import the email transporter from the nodemailer configuration
import { transporter } from "../config/nodemailer.config.js";

/**
 * Sends an email notification about booking status to the user
 * @param {Object} bid - The booking information object
 * @param {Boolean} status - True if booking is accepted, false if rejected
 * @returns {Promise<void>}
 */
async function sendMail(bid,status)
{
    // Create the email object with sender, recipient, subject and HTML content
    const mail={
        from:process.env.EMAIL_USER,
        to:"krishgkp29@gmail.com",
        subject:`Your booking has been ${status ? "accepted" : "rejected"}`,
        html:`
        <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
        }
        .container {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .header {
            background-color: ${status ? "#4CAF50" : "#F44336"};
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
            margin-bottom: 20px;
        }
        .booking-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .detail-row {
            margin-bottom: 10px;
        }
        .label {
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
        }
        .button {
            display: inline-block;
            background-color: ${status ? "#4CAF50" : "#F44336"};
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Booking ${status ? "Accepted" : "Rejected"}</h2>
        </div>
        
        <p>Dear <strong>${bid.bookerData.bookerName}</strong>,</p>
        
        <p>We're writing to inform you that your booking request has been <strong>${status ? "accepted" : "rejected"}</strong>.</p>
        
        <div class="booking-details">
            <div class="detail-row">
                <span class="label">Booking ID:</span> ${bid._id || "N/A"}
            </div>
            <div class="detail-row">
                <span class="label">Start Date:</span> ${new Date(bid.startDate).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
            </div>
            <div class="detail-row">
                <span class="label">End Date:</span> ${new Date(bid.endDate).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
            </div>
            ${status ? 
                `<div class="detail-row">
                    <span class="label">Total Amount:</span> ${bid.bidAmount || "N/A"}
                </div>` : 
                `<div class="detail-row">
                    <span class="label">Reason:</span> We apologize, but we are unable to accommodate your booking at this time.
                </div>`
            }
        </div>
        
        ${status ? 
            `<p>Thank you for choosing our service. We look forward to serving you!</p>
            <center><a href="#" class="button">View Booking Details</a></center>` : 
            `<p>We apologize for any inconvenience this may cause. Please feel free to try booking again for different dates.</p>
            <center><a href="#" class="button">Make New Booking</a></center>`
        }
        
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    }
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.log(error);
    }
}

export default sendMail;