
import Listing from "../../models/bookings/listing.schema.js";
import { validateListing } from "../../utils/index.js";


const listingController = async (req, res) => {
//   const { email, password } = req.body;

  try {
    const { error } = validateListing(req.body);
    if (error) {
        return res.status(400).json({ error: error, message: "Validation failed" });
      }
    console.log(req.body);

    await new Listing({
          ...req.body,
        }).save();
    res.status(201).send({ message: "vehicle Listed succesfully" });
  } catch (err) {
    console.error("Error during listing:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { listingController };
