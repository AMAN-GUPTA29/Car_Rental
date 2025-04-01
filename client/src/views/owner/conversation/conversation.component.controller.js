carRentalApp.controller("ChatControllerOwner", ['$timeout',"$scope","ownerdb","SessionService","FileService","DateService", function($timeout,$scope,ownerdb,SessionService,FileService,DateService) {
    
    
    /**
     * @type {Array} conversations
     * @type {Array} messages
     * 
     */
    $scope.conversations = [];
    $scope.messages = [];
    $scope.chatTitle = "";
    $scope.showBookingDetails = false;
    $scope.bookingDetails = {};
    $scope.conversationId = null;
    let selectedConvo;

    /**
     * @function init
     * @description This function is used call to load conversations
     */
    $scope.init= function (){
        loadConversations();
    }
    
    /**
     * @function loadConversations
     * @description This function is used to load conversations
     */
    function loadConversations() {
        const user =SessionService.getUser();
        ownerdb.loadingconversation(user.id).then((result) => {
            $scope.conversations=result;
        }).catch((err) => {
            console.log(err)
        });
    }


/**
 * 
 * @param {*} convo 
 * @description This function is used to load chat messages
 */
$scope.loadChatMessages =  function (convo) {
    $scope.showBookingDetails = false;    
    $scope.chatTitle = convo.bookerName;
    $scope.messages = [];
    selectedConvo = convo;
    $scope.conversationId = convo.ownerId + convo.bookerId;
    
    socket = io("http://127.0.0.1:8080");

    console.log("Socket :: " , socket);
    socket.emit("joinChat", $scope.conversationId);
    socket.on("newMessage", (message) => {
      if(message.conversationId === $scope.conversationId){
          $scope.messages.push(message);
          $timeout();
      }
    });

    /**
     * @function getBid
     * @description This function is used to get the bid details
     * @param {string} ownerID
     * @param {string} bookerID
     * @returns {Promise}
     */
    // ownerdb.getBid(convo.ownerID,convo.bookerID).then((result) => {
    //     console.log(result);
    //     const biddingDetails=result[result.length-1];
    //     console.log(biddingDetails);
    //     if (biddingDetails ) {
    //         $scope.bookingDetails = {
    //             carName: `${biddingDetails.cardata.carMake} ${biddingDetails.cardata.carModel}`,
    //             carCategory: biddingDetails.cardata.carCategory,
    //             startDate: new Date(biddingDetails.startDate).toLocaleDateString(),
    //             endDate: new Date(biddingDetails.endDate).toLocaleDateString(),
    //             bidAmount: `$${biddingDetails.BidAmount}`,
    //             status: biddingDetails.status
    //         };
    //         $scope.statusColor = DateService.getStatusColor(biddingDetails.status);
    //         $scope.showBookingDetails = true;    
    //     }
    // }).catch((err) => {
    //     console.log(err)
    // });

    /**
     * @function getChatMessageOwner
     * @description This function is used to get the chat messages
     * @param {string} ownerID
     * @param {string} bookerID
     * @returns {Promise}
     */
    ownerdb.getChatMessageOwner(convo.ownerId,convo.bookerId).then((result) => {
        $scope.messages=result;
    }).catch((err) => {
        console.log(err);
    });
};

/**
 * @function sendMessage
 * @description This function is used to send message
 * @param {string} message
 * @param {string} file
 * @param {string} selectedConvo
 * @param {string} ownerdb
 * @returns {Promise}
 */
$scope.sendMessage =  function () {
    const message = $scope.messageInput?.trim();
    const file = $scope.imageFile;

    if (!message && !file) return;

    console.log(file)
    let base64Image = null;
    const usern =SessionService.getUser();
    const owner={
        ownerId:selectedConvo.ownerId,
        ownerName:selectedConvo.ownerName,
    }

    const user={
        id:selectedConvo.bookerId,
        bookerName:selectedConvo.bookerName,
        token:usern.token,
    }
    // if (file) {
    //     FileService.convertToBase64(file).then((result) => {
    //         ownerdb.saveChatMessage(result,"owner",true,selectedConvo).then((result) => {
    //             $scope.messages.push(result)
    //         }).catch((err) => {
    //             console.log(err)
    //         });
    //     }).catch((err) => {
    //         console.log(err)
    //     });
    // } else {
        ownerdb.saveConversation(owner,user,message,"owner",false).then((result) => {
            console.log("cscssd",result)
            // $scope.messages.push(result.chat)
        }).catch((err) => {
            console.log(err)
        });
        
    // }


};
    
}]);

