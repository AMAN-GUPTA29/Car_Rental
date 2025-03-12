carRentalApp.controller("BookingController", function ($scope,$stateParams,consumerdb,ImageService,DateService,SessionService,$timeout) {

    
    $scope.listingId = $stateParams.listingID;
    
    
    
    
    /**
     * @type {Object}
     * @type {Number} myInterval
     * @type {Object} bidplace
     * @type {Date} date
     * @type {dateOptions} dateOptions
     */
    $scope.bidplace = {
        endDate:null,
        startDate:null,
        bidAmount:null,
        triptype:"local"
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };

      /**
       * 
       * @param {*} data 
       */
      function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      }
    
      /**
       * @type {Date} date
       * @type {Date} startdate
       */
    $scope.date = new Date();
    $scope.startdate=$scope.bidplace.startDate;

    //variable to store the current massage and save it in db and then push back in chat Message
      /**
       * @type {Object} chat
       * @type {String} chatMessage
       * @type {Array} chatMessages
       * @type {String} conversationID
       */
$scope.chat={
    chatMessage:"",
    chatMessages:[]
}
// to store the booked dates of the car
let bookedDates;

// to store conversation ID
let conversationID="";


$scope.tochange=function()
{
    $scope.startdaten=$scope.bidplace.startDate;
}


/**
 * @description This function is used to initialize the controller
 */
  $scope.init = function () {
    getcarListingID();
  };




/**
 * @description This function is used to get chat with owner
 */
  function getchatwithowner(){
    const user = SessionService.getUser(); 
    conversationID = `${$scope.car.ownerID}${user.id}`;
    consumerdb.getchatmessages(conversationID).then((result) => {
        $scope.chat.chatMessages.push(...result);// pusing the messages in chatMessages
    }).catch((err) => {
        console.log(err);
    });
  }


/**
 * @description This function is used to get car listing by ID
 */
 function getcarListingID(){ 
    consumerdb.getCarListingById($scope.listingId).then((car) => {
            $scope.car = car;
            $scope.currentIndex=0;
            $scope.totalImages = car.cardata.images.length;

            getchatwithowner();
            consumerdb.getBookedDates($scope.listingId).then((result) => {
            bookedDates=result;
            console.log(bookedDates);
            }).catch((err) => {
                console.log(err);
            });
    }).catch((err) => {
        console.error(err);
    });
  }
  
 /**
  * @description This function is used to get the next image
  */
    $scope.nextImage = function () {
        $scope.currentIndex = ImageService.nextImagecar($scope.currentIndex, $scope.totalImages);
    };
/**
 * @description This function is used to get the previous image
 */
    $scope.prevImage = function () {
        $scope.currentIndex = ImageService.prevImagecar($scope.currentIndex, $scope.totalImages);
    };


/**
 * @description This function is used to book the car
 */
$scope.bookCar = function () {
    $scope.user=JSON.parse(sessionStorage.getItem("user")); 
    
    
    consumerdb.bookingServiceConsumer($scope.bidplace, $scope.car, $scope.user).then((result) => {
        console.log($scope.bidplace);

        $scope.bidplace = {
            endDate:null,
            startDate:null,
            bidAmount:null,
            triptype:null
        };
        
    }).catch((err) => {
        console.log(err)
    });  
    
};


/**
 * @description This function is used to send message
 * @param {string} message
 * @param {string} file
 */
$scope.sendMessage = function () {
        $scope.user = SessionService.getUser();
        consumerdb.saveConversation($scope.car,$scope.user,$scope.chat.chatMessage,"user", false).then((result) => {
            console.log($scope.chat.chatMessage);
            $scope.chat.chatMessages.push({ chatString: $scope.chat.chatMessage, sentBy: "user" });
            $scope.chat.chatMessage = "";
        }).catch((err) => {
            console.log(err)
            $scope.chat.chatMessage = "";
        });   
};


/**
 * 
 * @param {*} selectedDate 
 * @description This function is used to check the date to check if already booked
 * @returns {boolean}
 */
$scope.checkDate = function (selectedDate) {
    
    selectedDate=selectedDate.toISOString().split("T")[0];
    console.log(selectedDate)
        if (selectedDate && bookedDates.includes(selectedDate)) {
            alert("Date is already booked!");
            $timeout(function () {

                $scope.bidplace.startDate = "";
                $scope.bidplace.endDate = "";
                
            }, 0);
        }
    };





   /**
    * 
    * @returns {number}
    * @description This function is used to calculate the date difference
    */
    $scope.calculateDateDifference = function () {
        return DateService.calculateDateDifference($scope.startDate, $scope.endDate);
    };
});























  