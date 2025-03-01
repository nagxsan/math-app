import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
})

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;
