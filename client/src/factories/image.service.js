/**
 * @description for going to prev and next page of a crousal
 */
carRentalApp.factory("ImageService", function () {
    return {
      nextImage: function (car) {
        if (car.cardata.images && car.cardata.images.length > 0) {
          car.currentImageIndex = (car.currentImageIndex + 1) % car.cardata.images.length;
        }
      },
  
      prevImage: function (car) {
        if (car.cardata.images && car.cardata.images.length > 0) {
          car.currentImageIndex = (car.currentImageIndex - 1 + car.cardata.images.length) % car.cardata.images.length;
        }
      },


      nextImagecar: function (currentIndex, totalImages) {
        return (currentIndex + 1) % totalImages;
      },
  
      prevImagecar: function (currentIndex, totalImages) {
        return (currentIndex - 1 + totalImages) % totalImages;
      },
    };
  });
  