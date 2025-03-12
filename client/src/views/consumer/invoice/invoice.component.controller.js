carRentalApp.controller("InvoiceController", function($scope, SessionService,consumerdb) {

    /**
     * @type {Number} INVOICES_PER_PAGE
     * @type {Number} currentPage
     * @type {Array} allInvoices
     * @type {Array} displayedInvoices
     * @type {Boolean} isModalOpen
     * @type {Object} selectedInvoice
     * @type {Number} totalPages
     */
    $scope.INVOICES_PER_PAGE = 5;
    $scope.currentPage = 1;
    $scope.allInvoices = [];
    $scope.displayedInvoices = [];
    $scope.isModalOpen = false;
    $scope.selectedInvoice = null;

    /**
     * @description This function is used to initialize the controller
     */
    $scope.init= function (){
    
   getUnpaidInvoices();

    }
    /**
     * @description This function is used to get unpaid invoices
     * @returns
     */
    function getUnpaidInvoices()
    {
        const user =SessionService.getUser();
        consumerdb.getUnpaidInvoices(user.id).then(function(invoices) {
            $scope.allInvoices = invoices;
            console.log($scope.allInvoices);
            $scope.updateDisplayedInvoices();
        }).catch(function (error) {
            console.error("Error loading upcoming bookings:", error);
        });
    
    }
    /**
     * @description This function is used to change page
     */
    $scope.pageChanged = function() {
        let start = ($scope.currentPage - 1) * $scope.INVOICES_PER_PAGE;
        let end = start + $scope.INVOICES_PER_PAGE;
        $scope.displayedInvoices = $scope.allInvoices.slice(start, end);
    };

    /**
     * @description This function is used to update displayed invoices
     */
    $scope.updateDisplayedInvoices = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.INVOICES_PER_PAGE;
        $scope.displayedInvoices = $scope.allInvoices.slice(startIndex, startIndex + $scope.INVOICES_PER_PAGE);
        // $scope.totalPages = Math.ceil($scope.allInvoices.length / $scope.INVOICES_PER_PAGE);
    };

    /**
     * @description This function is used to go to next page
     */
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
            $scope.updateDisplayedInvoices();
        }
    };
    /**
     * @description This function is used to go to previous page
     */
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.updateDisplayedInvoices();
        }
    };
    /**
     * 
     * @param {*} invoice
     * @description This function is used to open invoice modal 
     */
    $scope.openInvoiceModal = function(invoice) {
        $scope.selectedInvoice = invoice;
        $scope.isModalOpen = true;
    };

    /**
     * @description This function is used to close modal
     */
    $scope.closeModal = function() {
        $scope.isModalOpen = false;
    };

    /**
     * @description This function is used to mark invoice as paid
     */
    $scope.markAsPaid = function() {
        consumerdb.markInvoicePaid($scope.selectedInvoice.invoiceid, $scope.selectedInvoice.historyID).then(function() {
            $scope.selectedInvoice.paid = true;
            $scope.isModalOpen = false;
            $scope.updateDisplayedInvoices();
        });
    };
    /**
     * @description This function is used to download invoice
     */
    $scope.downloadInvoice = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Invoice", 20, 20);

        doc.setFontSize(12);
        doc.text(`Invoice ID: ${$scope.selectedInvoice.invoiceid}`, 20, 30);
        doc.text(`Car: ${$scope.selectedInvoice.cardata.carMake} ${$scope.selectedInvoice.cardata.carModel}`, 20, 40);
        doc.text(`Booker: ${$scope.selectedInvoice.booker.bookerName}`, 20, 50);
        doc.text(`Amount: $${$scope.selectedInvoice.finalamount}`, 20, 60);
        doc.text(`Status: ${$scope.selectedInvoice.paid ? "Paid" : "Unpaid"}`, 20, 70);
        
        doc.save(`${$scope.selectedInvoice.invoiceid}-invoice.pdf`);
    };


   
});
