/**
 * @import Joi validation library
 */
import Joi from "joi";

/**
 * @description Validates car listing data against defined schema
 * @param {Object} data - Car listing data to validate
 * @returns {Object} - Validation result with error details if any
 */
const validateListing=(data)=>{
  /**
     * @type {Joi.ObjectSchema}
     * @description Schema definition for car listing validation
     */
    const carSchema = Joi.object({
      /**
         * @description Car data validation with nested properties
         */ 
        carData: Joi.object({
          /**
           * @description Base price validation - must be a positive number
           */
          basePrice: Joi.number().min(0).required().label("basePrice"),

           /**
           * @description Outstation price validation - must be a positive number
           */
          outstationPrice: Joi.number().min(0).required().label("outstationPrice"),

          /**
           * @description Car address validation
           */
          carAddress: Joi.string().required().label("carAddress"),

           /**
           * @description Car category validation
           */
          carCategory: Joi.string().required().label("carCategory"),

          /**
           * @description Car color validation - must be a valid hex color code
           */
          carColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required().label("carColor"),

          /**
           * @description Car description validation - optional
           */
          carDescription: Joi.string().allow("").optional().label("carDescription"),

          /**
           * @description Car make/brand validation
           */
          carMake: Joi.string().required().label("carName"),

            /**
           * @description Car mileage validation - must be a positive number
           */
          carMileage: Joi.number().min(0).required().label("carMileage"),

          /**
           * @description Car model validation
           */
          carModel: Joi.string().required().label("carModel"),

          
          /**
           * @description Car transmission validation - must be one of the specified types
           */
          carTransmission: Joi.string().valid("Manual", "Automatic", "Semi-Automatic").required().label("carTransmission"),

          /**
           * @description Car year validation - must be between 1985 and next year
           */
          carYear: Joi.number().min(1985).max(new Date().getFullYear() + 1).required().label("carYear"),

          /**
           * @description Car city validation
           */
          carcity: Joi.string().required().label("carcity"),
        }).required().label("carData"),
        
                /**
         * @description Car images validation - must be an array of at least one URI
         */

        images: Joi.array()
          .items(Joi.string().uri().required())
          .min(1)
          .required()
          .label("images"),

          /**
         * @description Deleted status validation with default value
         */
        isDeleted: Joi.boolean()
          .default(false)
          .label("isDeleted"),

          /**
         * @description Blocked status validation with default value
         */
        isBlocked:Joi.boolean().default(false).label("isDeleted"),

        /**
         * @description Owner details validation with nested properties
         */
        ownerDetails: Joi.object({
           /**
           * @description Owner ID validation
           */
          ownerID: Joi.string()
            .required()
            .label("ownerID"),
            /**
           * @description Owner name validation
           */
          ownerName: Joi.string().required().label("ownerName"),
          /**
           * @description Owner email validation - standard email format
           */
          ownerEmail: Joi.string()
                .email({ tlds: { allow: false } })
                .required()
                .messages({
                  "string.email": "Invalid email format"
                }),
        }).required().label("ownerDetails"),
      }).options({ abortEarly: false });
      
      /**
     * @description Execute validation
     */
    return carSchema.validate(data)
  
} ;
export { validateListing }; 






