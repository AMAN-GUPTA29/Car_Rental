import Joi from "joi";


const validateListing=(data)=>{
    const carSchema = Joi.object({ 
        carData: Joi.object({
          basePrice: Joi.number().min(0).required().label("basePrice"),
          outstationPrice: Joi.number().min(0).required().label("outstationPrice"),
          carAddress: Joi.string().required().label("carAddress"),
          carCategory: Joi.string().required().label("carCategory"),
          carColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required().label("carColor"),
          carDescription: Joi.string().allow("").optional().label("carDescription"),
          carName: Joi.string().required().label("carName"),
          carMileage: Joi.number().min(0).required().label("carMileage"),
          carModel: Joi.string().required().label("carModel"),
          carTransmission: Joi.string().valid("Manual", "Automatic").required().label("carTransmission"),
          carYear: Joi.number().min(1985).max(new Date().getFullYear() + 1).required().label("carYear"),
          carcity: Joi.string().required().label("carcity"),
        }).required().label("carData"),
        
        images: Joi.array()
          .items(Joi.string().uri().required()) // Validate URLs
          .min(1)
          .required()
          .label("images"),
        
        isDeleted: Joi.boolean()
          .default(false)
          .label("isDeleted"),

        isBlocked:Joi.boolean().default(false).label("isDeleted"),
        
        ownerDetails: Joi.object({
          ownerID: Joi.string()
            .required()
            .label("ownerID"),
          ownerName: Joi.string().required().label("ownerName"),
          ownerEmail: Joi.string().email().required().label("ownerEmail"),
        }).required().label("ownerDetails"),
      });
      
    return carSchema.validate(data)
  
} ;
export { validateListing }; 






