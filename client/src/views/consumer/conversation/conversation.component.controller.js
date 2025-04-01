carRentalApp.controller("ChatControllerConsumer", [
  "$timeout",
  "$scope",
  "consumerdb",
  "SessionService",
  "FileService",
  "DateService",
  function (
    $timeout,
    $scope,
    consumerdb,
    SessionService,
    FileService,
    DateService
  ) {
    /**
     * @type {Array} conversations
     * @type {Array} messages
     * @type {String} chatTitle
     * @type {Boolean} showBookingDetails
     * @type {Object} bookingDetails
     *
     */
    $scope.conversations = [];
    $scope.messages = [];
    $scope.chatTitle = "";
    $scope.showBookingDetails = false;
    $scope.bookingDetails = {};
    $scope.conversationId;

    let selectedConvo;

    /**
     * @function init
     * @description This function is used call to load conversations
     */
    $scope.init = function () {
      loadConversations();
      
    };

    /**
     * @function loadConversations
     * @description This function is used to load conversations
     */
    function loadConversations() {
      const user = SessionService.getUser();

      consumerdb
        .loadingconversation(user.id)
        .then((result) => {
          $scope.conversations = result.conversations;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    /**
     *
     * @param {*} convo
     * @description This function is used to load chat messages
     *
     */
    $scope.loadChatMessages = function (convo) {
      $scope.showBookingDetails = false;
      $scope.chatTitle = convo.ownerName;
      $scope.messages = [];
      selectedConvo = convo;
      console.log("sc", selectedConvo);
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
      // consumerdb.getBid(convo.ownerID,convo.bookerID).then((result) => {
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

      consumerdb
        .getChatMessageConsumer(convo.ownerId, convo.bookerId)
        .then((result) => {
          $scope.messages = result.chats;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    /**
     *
     * @returns {number}
     * @description This function is used to send message
     *
     */
    $scope.sendMessage = function () {
      const message = $scope.messageInput?.trim();
      const file = $scope.imageFile;
      console.log("scscs", selectedConvo);
      if (!message && !file) return;
      const usern = SessionService.getUser();
      const owner = {
        ownerId: selectedConvo.ownerId,
        ownerName: selectedConvo.ownerName,
      };

      const user = {
        id: selectedConvo.bookerId,
        bookerName: selectedConvo.bookerName,
        token: usern.token,
      };

      console.log(file);
      // let base64Image = null;
      // if (file) {
      //     FileService.convertToBase64(file).then((result) => {
      //         consumerdb.saveChatMessage(result,"user",true,selectedConvo).then((result) => {
      //             $scope.messages.push(result)
      //         }).catch((err) => {
      //             console.log(err)
      //         });
      //     }).catch((err) => {
      //         console.log(err)
      //     });
      // } else {
      consumerdb
        .saveConversation(owner, user, message, "user", false)
        .then((result) => {
          // $scope.messages.push(result.chat);
        })
        .catch((err) => {
          console.log(err);
        });

      // }
      ///
    };
  },
]);
