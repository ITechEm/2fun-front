import mongoose, {model, models, Schema} from "mongoose";

const AddressSchema = new Schema({
  userEmail: {type:String, unique:true, required:true},
  name: String,
  email: String,  
  phone: {type: Number, required: true},
  streetAddress: String,
  city: String,
  postalCode: String,
  country: String,
  clientNumber: String,
});

export const Address = models?.Address || model('Address', AddressSchema);