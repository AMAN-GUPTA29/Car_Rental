/**
 * @description for going to prev and next page of a crousal
 */
carRentalApp.factory("ImageService", function () {
    return {
      nextImage: function (car) {
        if (car.images && car.images.length > 0) {
          car.currentImageIndex = (car.currentImageIndex + 1) % car.images.length;
        }
      },
  
      prevImage: function (car) {
        if (car.images && car.images.length > 0) {
          car.currentImageIndex = (car.currentImageIndex - 1 + car.images.length) % car.images.length;
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
  