import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import JoiPhoneNumber from "joi-phone-number";

const myJoi = Joi.extend(JoiPhoneNumber);

const validateUser=(data)=>{
    const schema=Joi.object({
        aadhar:Joi.string().pattern(/^[0-9]{12}$/).required().label("aadhar"),
        userName:Joi.string().required().alphanum().min(3).label("name"),
        email:Joi.string().email().required().label("email"),
        password:passwordComplexity().required().label("password"),
        phone:myJoi.string()
        .phoneNumber({ defaultCountry: 'IN', format: 'national' })
        .required()
        .label("phone"),
        blocked:Joi.boolean().required().label("blocked"),
        role:Joi.string().required().label("role"),
        authorise:Joi.boolean().required().label("authorise"),
    });
    return schema.validate(data)
  
} ;
export { validateUser }; 









