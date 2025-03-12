/**
 * Name: idGeneratorService
 * Description: This service is used to generate unique IDs for users, listings, bookings, chat messages, and history.
 */
carRentalApp.service("idGeneratorService", function () {
    
    /**
     * 
     * @returns {string}
     * @description Generates a unique ID for a user.
     */
    this.generateUserID = function () {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${randomPart}`;
    };

    /**
     * 
     * @returns {string}
     * @description Generates a unique ID for a listing.
     */
    this.generateListingID = function () {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 8);
        return `listing-${timestamp}-${randomPart}`;
    };

    /**
     * 
     * @returns {string}
     * @description Generates a unique ID for a booking.
     */
    this.generateBookingID = function () {
        const prefix = "BKG";
        const timestamp = Date.now();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${timestamp}-${randomNum}`;
    };

    /**
     * 
     * @returns {string}
     * @description Generates a unique ID for a history.
     */
    this.generateHistoryID = function () {
        const timestamp = Date.now();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `HIST-${timestamp}-${randomNum}`;
    };

    /**
     * 
     * @returns {string}
     * @description Generates a unique ID for a chat.
     */
    this.generateChatID = function () {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substr(2, 9);
        return `${timestamp}-${randomString}`;
    };

    /**
     * 
     * @returns {string}
     * @description Generates a unique ID for a invoice.
     */
    this.getinvoiceID =function () {
        const timestamp = new Date().getTime(); 
        const randomString = Math.random().toString(36).substr(2, 9); 
        return `INVO-${timestamp}-${randomString}`;
    }
});
