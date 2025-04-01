/**
 * @import Joi validation library
 * @import Password complexity validation extension
 * @import Phone number validation extension
 */
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import JoiPhoneNumber from "joi-phone-number";

/**
 * @type {Joi}
 * @description Extended Joi instance with phone number validation capabilities
 */
const myJoi = Joi.extend(JoiPhoneNumber);
 /**
   * @type {Joi.ObjectSchema}
   * @description Schema definition for user validation
   */
const validateUser = (data) => {
  const schema = Joi.object({
    /**
     * @description Aadhar validation - must be exactly 12 digits
     */
    aadhar: Joi.string()
      .pattern(/^\d{12}$/)
      .required()
      .messages({
        "string.pattern.base": "Aadhar must be 12 digits",
        "any.required": "Aadhar is required"
      }),

      /**
     * @description Username validation - alphanumeric, minimum 3 characters
     */
    userName: Joi.string()
      .min(3)
      .alphanum()
      .required()
      .label("username") 
      .messages({
        "string.alphanum": "Username must contain only letters and numbers",
        "string.min": "Username must be at least 3 characters"
      }),

      /**
     * @description Email validation - standard email format
     */

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Invalid email format"
      }),

      /**
     * @description Password validation with complexity requirements
     */
    password: passwordComplexity({
      min: 8,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4
    }).required(),

    /**
     * @description Phone validation - must be valid Indian phone number
     */
    phone: myJoi.string()
      .phoneNumber({
        defaultCountry: "IN",
        format: "e164",
        strict: true
      })
      .required()
      .messages({
        "phoneNumber.invalid": "Invalid Indian phone number"
      }),

      /**
     * @description Role validation - must be one of the specified roles
     */
    role: Joi.string()
      .valid("admin", "user","owner")  // Add allowed roles
      .required(),

      /**
     * @description Authorization flag validation
     */
    authorise: Joi.boolean()
      .required()
      .truthy("true")
      .falsy("false"),

       /**
     * @description Blocked status validation with default value
     */
    blocked: Joi.boolean()
      .default(false)  // Set default value
      .required(),

      
    id:Joi.string().allow(null).optional()
  }).options({ abortEarly: false });  // Collect all errors

  return schema.validate(data, { convert: false }); // Prevent type conversion
};

export { validateUser };
