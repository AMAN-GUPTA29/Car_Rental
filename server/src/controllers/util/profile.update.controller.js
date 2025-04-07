




import User from "../../models/users/user.schema.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const updateDataUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const data = req.body;

      console.log(id,data)
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid document ID'
        });
      }

      /**
           * @type {String}
           * @description Generate salt for password hashing
           */
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
      
          /**
           * @type {String}
           * @description Hash password with salt
           */
          const hashedPassword = await bcrypt.hash(data.password, salt);
          data.password=hashedPassword;

          

          console.log("hasd",hashedPassword);
      
      const updatedDocument = await User.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true } // Return updated document & run schema validators
      );

     
      
      if (!updatedDocument) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      const tokenn = updatedDocument.generateAuthToken(updatedDocument);
      console.log("okoko",tokenn)
      updatedDocument.token=tokenn;
      return res.status(200).json({
        success: true,
        message: 'Data updated successfully',
        data: updatedDocument,
        token:tokenn
      });
      
    } catch (error) {
      console.error('Error updating data in MongoDB:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update data',
        error: error.message
      });
    }
  };
  


  export { updateDataUser };