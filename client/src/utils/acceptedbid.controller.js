carRentalApp.controller("bidaceeptedController", ["$scope", "$window","toastifyService", 
    function ($scope, $window,toastifyService) {
        
        $scope.init = function() {
            console.log("Initialize socket connection");
            let socket = io("http://127.0.0.1:8080", {
                transports: ['websocket'],
                reconnection: true
            });
            
            const user = JSON.parse(sessionStorage.getItem("user"));
            console.log("Socket initialized:", socket);
            console.log("User:", user);
    
            if (user && user.id) {
                socket.on('connect', () => {
                    console.log('Socket connected with ID:', socket.id);
                    // Join room after successful connection
                    socket.emit('join_room', user.id);
                });

                socket.on('room_joined', (data) => {
                    console.log('Successfully joined room:', data);
                });

                socket.on("booking", function(bid) {
                    console.log("New booking received:", bid);
                    toastifyService.success("Booking Processed Successfully! and send for owner acceptance");
                });

                socket.on('disconnect', () => {
                    console.log('Socket disconnected, will rejoin on reconnection');
                });

                socket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                });
            } else {
                console.log("No user found in session");
            }
        };
    }]);