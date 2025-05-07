/**
 * @file Bidding data validation schema using Joi
 * @description Validates all fields for car rental bidding system
 */

import Joi from "joi";

/**
 * @function validateBidding
 * @description Main validation function for bid submission data
 * @param {Object} data - Bid data object to validate
 * @returns {ValidationResult} Joi validation result object
 */
const validateBidding = (data) => {
  /**
   * @constant {Joi.ObjectSchema} bidSchema
   * @description Defines complete validation structure with:
   * - Field-specific validation rules
   * - Cross-field dependencies
   * - Custom error messages
   */
  const bidSchema = Joi.object({
    
    /** 
     * @description Validates owner information
     * @property {string} ownerID - Required MongoDB-style ID
     * @property {string} ownerName - Full name validation
     * @property {string} ownerEmail - Standard email format
     */
    ownerDetails: Joi.object({
      ownerID: Joi.string()
        .required()
        .label("ownerID")
        .description("MongoDB ObjectID format"),
        
      ownerName: Joi.string()
        .required()
        .label("ownerName")
        .description("Owner's full name"),
        
      ownerEmail: Joi.string()
        .email({ tlds: { allow: false } }) // Disallow TLD validation
        .required()
        .label("ownerEmail")
        .description("Valid email address")
    })
      .required()
      .label("ownerDetails"),

    /**
     * @description Validates car specifications and pricing
     * @property {number} basePrice - Non-negative base rental price
     * @property {string} carColor - 6-digit hex color code
     * @property {number} carYear - Between 1985 and next calendar year
     */
    carData: Joi.object({
      basePrice: Joi.number()
        .min(0)
        .required()
        .label("basePrice")
        .description("Base rental price per day"),
        
      outstationPrice: Joi.number()
        .min(0)
        .required()
        .label("outstationPrice")
        .description("Price for long-distance trips"),
        
      carAddress: Joi.string()
        .required()
        .label("carAddress")
        .description("Vehicle location address"),
        
      carCategory: Joi.string()
        .required()
        .label("carCategory")
        .description("Vehicle classification"),
        
      carColor: Joi.string()
        .pattern(/^#[0-9A-Fa-f]{6}$/)
        .required()
        .label("carColor")
        .description("Hex color code with # prefix"),
        
      carDescription: Joi.string()
        .allow("")
        .optional()
        .label("carDescription")
        .description("Optional vehicle description"),
        
      carMake: Joi.string()
        .required()
        .label("carMake")
        .description("Manufacturer/brand name"),
        
      carMileage: Joi.number()
        .min(0)
        .required()
        .label("carMileage")
        .description("Miles per gallon equivalent"),
        
      carModel: Joi.string()
        .required()
        .label("carModel")
        .description("Specific model name"),
        
      carTransmission: Joi.string()
        .valid("Manual", "Automatic", "Semi-Automatic")
        .required()
        .label("carTransmission")
        .description("Transmission type selection"),
        
      carYear: Joi.number()
        .min(1985)
        .max(new Date().getFullYear() + 1) // Allow next year's models
        .required()
        .label("carYear")
        .description("Manufacture year"),
        
      carcity: Joi.string()
        .required()
        .label("carcity")
        .description("Registration city"),
        
      listingId: Joi.string()
        .required()
        .label("listingId")
        .description("Associated listing ID")
    })
      .required()
      .label("carData"),

    /**
     * @description Validates renter information
     * @property {string} bookerId - User identification
     * @property {number} aadhar - 12-digit Indian identity number
     */
    bookerData: Joi.object({
      bookerName: Joi.string()
        .required()
        .label("bookerName")
        .description("Renter's full name"),
        
      bookerId: Joi.string()
        .required()
        .label("bookerId")
        .description("User database ID"),
        
      aadhar: Joi.number()
        .integer()
        .positive()
        .required()
        .label("aadhar")
        .description("Government-issued ID number")
    })
      .required()
      .label("bookerData"),

    /** 
     * @description Validates image URLs
     * @requires At least one image URL
     */
    images: Joi.array()
      .items(
        Joi.string()
          .uri()
          .required()
          .label("imageURL")
          .description("S3 bucket image URL")
      )
      .min(1)
      .required()
      .label("images")
      .description("Minimum one vehicle image"),

    /**
     * @description Validates rental dates
     * @property {date} startDate - ISO8601 format
     * @property {date} endDate - Must be after startDate
     */
    startDate: Joi.date()
      .iso()
      .required()
      .label("startDate")
      .description("Trip start date/time"),
      
    endDate: Joi.date()
      .iso()
      .min(Joi.ref("startDate")) // Relative date validation
      .required()
      .label("endDate")
      .description("Trip end date/time")
      .messages({
        "date.min": "End date cannot be before start date"
      }),

    /** @description Minimum bid amount validation */
    bidAmount: Joi.number()
      .min(1)
      .required()
      .label("bidAmount")
      .description("Minimum bid value"),
      
    /** @description Trip type classification */
    bookType: Joi.string()
      .valid("outstation", "local")
      .required()
      .label("bookType")
      .description("Rental distance category"),
      
    /**
     * @description Validates km values (-1 indicates unset)
     * @property {number} startkm - Default -1 for local trips
     * @property {number} endkm - Default -1 for local trips
     */
    startkm: Joi.number()
      .min(-1)
      .required()
      .label("startkm")
      .description("Starting odometer reading"),
      
    endkm: Joi.number()
      .min(-1)
      .required()
      .label("endkm")
      .description("Ending odometer reading"),

    /** @description Current bid status */
    status: Joi.string()
      .required()
      .label("status")
      .description("Bid processing state"),
      
    /** @description Optional database ID for updates */
    id: Joi.any()
      .optional()
      .label("id")
      .description("Database identifier (auto-generated)")
  }).options({
    abortEarly: false // Return all validation errors at once
  });

  return bidSchema.validate(data);
};

export { validateBidding };
