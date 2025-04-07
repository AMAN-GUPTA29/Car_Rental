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
    $scope.totalInvoices= 0;

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
        consumerdb.getUnpaidInvoices(user.id,$scope.currentPage).then(function(invoices) {
            $scope.allInvoices = invoices.invoices;
            console.log("wd",$scope.allInvoices);
            $scope.totalInvoices = invoices.totalInvoices;
            // $scope.pageChanged();
        }).catch(function (error) {
            console.error("Error loading upcoming bookings:", error);
        });
    
    }


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
    $scope.pageChanged=function(){
        getUnpaidInvoices();
    }
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
        consumerdb.markInvoicePaid($scope.selectedInvoice._id).then(function() {
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
        const options = {}
        console.log($scope.selectedInvoice);
        const defaultOptions = {
            includeCompanyLogo: true,
            showDetailedCalculations: true,
            includeTerms: true,
            companyName: "Book Plateform",
            companyAddress: "123 Transport Street, Bangalore, India",
            companyContact: "+91 1234567890",
            companyEmail: "support@carbook.com",
            companyWebsite: "www.bookcar.com"
          };
          // Merge default options with provided options
          const settings = {...defaultOptions, ...options};
          // Colors
          const primaryColor = [41, 128, 185]; // #2980B9
          const secondaryColor = [52, 73, 94]; // #34495E
          const accentColor = [231, 76, 60];   // #E74C3C
          // Spacing
          const lineGap = 6;
          const sectionGap = 10;
          let y = 15;
          // Helper functions
          const formatCurrency = (amount) => `₹${parseFloat(amount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
          const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'});
          // Calculate booking values
          var startDatee = new Date($scope.selectedInvoice.startDate);
var endDatee = new Date($scope.selectedInvoice.endDate);
var timeDifference = endDatee.getTime() - startDatee.getTime();
          const duration = timeDifference / (1000 * 3600 * 24);
          console.log(duration)
          const baseRentalCost = $scope.selectedInvoice.bidAmount * duration;
        //   const distanceCost = (booking.distanceTravelled || 0) * booking.car.pricePerKm;
        //   const outstationCharges = $scope.selectedInvoice.bookType === 'outStation' ? (booking.car.outStationCharges * duration) : 0;
        //   const lateFees = booking.lateFee || 0;
          const subtotal = baseRentalCost ;
          const gst = subtotal * 0.18; // Assuming 18% GST
          const totalAmount = subtotal + gst;
          // Verify the calculated amount against the stored amount (should be close)
        //   const storedTotal = booking.totalAmount;
          // Set document properties
          doc.setProperties({
            title: `Booking Invoice ${$scope.selectedInvoice._id}`,
            subject: 'Car Rental Invoice',
            author: 'Paltform',
            keywords: 'invoice, car rental',
            creator: 'Booking PDF Generator'
          });
          // Header section with company info
          doc.setFillColor(41, 128, 185); // primaryColor
          doc.rect(0, 0, 210, 40, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(24);
          doc.setFont("helvetica", "bold");
          doc.text(settings.companyName, 20, y + 5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(settings.companyAddress, 20, y + 12);
          doc.text(`Tel: ${settings.companyContact} | Email: ${settings.companyEmail}`, 20, y + 18);
          // Invoice title
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text("TAX INVOICE", 170, y + 10, { align: "right" });
          y += 45; // Move below header
          // Invoice details
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          // Invoice details box
          doc.setDrawColor(220, 220, 220);
          doc.setFillColor(249, 249, 249);
          doc.roundedRect(140, y, 50, 25, 1, 1, 'FD');
          doc.setFont("helvetica", "bold");
          doc.text("Invoice Number:", 142, y + 5);
          doc.text("Invoice Date:", 142, y + 11);
          doc.text("Booking ID:", 142, y + 17);
          doc.setFont("helvetica", "normal");
          doc.text(`INV-${$scope.selectedInvoice._id.substr(-6)}`, 190, y + 5, { align: "right" });
          doc.text(formatDate(new Date()), 190, y + 11, { align: "right" });
          doc.text($scope.selectedInvoice._id, 190, y + 22, { align: "right" });
          // Customer details
          doc.setFillColor(241, 241, 241);
          doc.roundedRect(20, y, 110, 25, 1, 1, 'FD');
          doc.setFont("helvetica", "bold");
          doc.text("Billed To:", 22, y + 5);
          doc.setFont("helvetica", "normal");
          doc.text($scope.selectedInvoice.bookerData.bookerName, 22, y + 11);
          doc.text($scope.selectedInvoice.ownerDetails.ownerEmail, 22, y + 17);
          doc.text($scope.selectedInvoice.bookerData.phone || "No phone provided", 22, y + 23);
          y += 35; // Move below customer/invoice details
          // Car & Booking summary
          doc.setFillColor(52, 73, 94); // secondaryColor
          doc.rect(20, y, 170, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text("BOOKING DETAILS", 105, y + 5, { align: "center" });
          y += 10;
          // Reset text color
          doc.setTextColor(0, 0, 0);
          // Create a table for booking summary
          doc.setFillColor(245, 245, 245);
          doc.rect(20, y, 170, 30, 'F');
          doc.setFont("helvetica", "bold");
          doc.text("Car:", 22, y + 5);
          doc.text("Category:", 22, y + 11);
        //   doc.text("Fuel Type:", 22, y + 17);
          doc.text("Trip Type:", 22, y + 17);
          doc.setFont("helvetica", "normal");
          doc.text($scope.selectedInvoice.carData.carMake +" " +$scope.selectedInvoice.carData.carModel, 50, y + 5);
          doc.text($scope.selectedInvoice.carData.carCategory, 50, y + 11);
        //   doc.text(booking.car.fuelType, 50, y + 17);
          doc.text($scope.selectedInvoice.bookType === 'outStation' ? 'Outstation' : 'In-City', 50, y + 17);
          doc.setFont("helvetica", "bold");
          doc.text("Duration:", 100, y + 5);
          doc.text("Start Date:", 100, y + 11);
          doc.text("End Date:", 100, y + 17);
        //   doc.text("Distance:", 100, y + 23);
          doc.setFont("helvetica", "normal");
          doc.text(`${duration} days`, 140, y + 5);
          doc.text(formatDate($scope.selectedInvoice.startDate), 140, y + 11);
          doc.text(formatDate($scope.selectedInvoice.endDate), 140, y + 17);
        //   doc.text(`${$scope.selectedInvoice.distanceTravelled || 0} km`, 140, y + 23);
          y += 40; // Move to charges section
          // Charges breakdown header
          doc.setFillColor(52, 73, 94); // secondaryColor
          doc.rect(20, y, 170, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text("CHARGES BREAKDOWN", 105, y + 5, { align: "center" });
          y += 10;
          // Reset text color
          doc.setTextColor(0, 0, 0);
          // Table headers for charges
          doc.setFillColor(230, 230, 230);
          doc.rect(20, y, 110, 8, 'F');
          doc.rect(130, y, 60, 8, 'F');
          doc.setFont("helvetica", "bold");
          doc.text("Description", 25, y + 5);
          doc.text("Amount", 165, y + 5, { align: "right" });
          y += 10;
          // Table rows for charges
          doc.setFont("helvetica", "normal");
          // Base rental
          doc.text(`Base Rental (${formatCurrency($scope.selectedInvoice.carData.basePrice)} × ${duration} days)`, 25, y + 5);
          doc.text(formatCurrency(baseRentalCost), 165, y + 5, { align: "right" });
          y += 8;
          // Distance charge
        //   doc.text(`Distance Charge (${$scope.selectedInvoice.distanceTravelled || 0} km × ${formatCurrency(booking.car.pricePerKm)})`, 25, y + 5);
        //   doc.text(formatCurrency(distanceCost), 165, y + 5, { align: "right" });
          y += 8;
          // Outstation charges if applicable
          if ($scope.selectedInvoice.bookType === 'outStation') {
            doc.text(`Outstation Charges (${formatCurrency($scope.selectedInvoice.carData.outStationCharges)} × ${duration} days)`, 25, y + 5);
            doc.text(formatCurrency(outstationCharges), 165, y + 5, { align: "right" });
            y += 8;
          }
          // Late fees if applicable
        //   if (lateFees > 0) {
        //     doc.text(`Late Return Fees (${$scope.selectedInvoice.lateDays || 0} days)`, 25, y + 5);
        //     doc.text(formatCurrency(lateFees), 165, y + 5, { align: "right" });
        //     y += 8;
        //   }
          // Subtotal
          doc.setDrawColor(200, 200, 200);
          doc.line(20, y, 190, y);
          y += 5;
          doc.setFont("helvetica", "bold");
          doc.text("Subtotal", 25, y + 5);
          doc.text(formatCurrency(subtotal), 165, y + 5, { align: "right" });
          y += 8;
          // GST
          doc.setFont("helvetica", "normal");
          doc.text("GST (18%)", 25, y + 5);
          doc.text(formatCurrency(gst), 165, y + 5, { align: "right" });
          y += 8;
          // Total
          doc.setDrawColor(0, 0, 0);
          doc.line(130, y, 190, y);
          y += 5;
          doc.setFillColor(231, 76, 60); // accentColor
          doc.rect(130, y, 60, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text("TOTAL", 140, y + 5);
          doc.text(formatCurrency(totalAmount), 165, y + 5, { align: "right" });
          y += 15;
          // Payment status
          doc.setTextColor(0, 0, 0);
          doc.setFillColor(
            $scope.selectedInvoice.carData.paymentStatus === 'paid' ? 46 : 243,
            $scope.selectedInvoice.carData.paymentStatus === 'paid' ? 204 : 156,
            $scope.selectedInvoice.carData.paymentStatus === 'paid' ? 113 : 18
          );
          doc.roundedRect(20, y, 170, 10, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text(
            $scope.selectedInvoice.carData.paymentStatus === 'paid' ? "PAYMENT COMPLETED" : "PAYMENT PENDING",
            105, y + 6, { align: "center" }
          );
          y += 20;
          // Terms and conditions
          if (settings.includeTerms) {
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text("Terms & Conditions:", 20, y);
            doc.text("1. This is a computer-generated invoice and does not require a signature.", 20, y + 4);
            doc.text("2. All disputes are subject to the jurisdiction of courts in Bangalore only.", 20, y + 8);
            doc.text("3. For complete terms and conditions, please visit our website.", 20, y + 12);
          }
          // Footer
          doc.setFillColor(41, 128, 185); // primaryColor
          doc.rect(0, 280, 210, 17, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text("Thank you for choosing myplateform for your journey!", 105, 288, { align: "center" });
          doc.text(settings.companyWebsite, 105, 292, { align: "center" });
          
        doc.save(`${$scope.selectedInvoice._id}-invoice.pdf`);
    };



    


   
});




///
