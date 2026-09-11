import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: { type: String, default: "Fitness Enthusiast" },
  location: { type: String, default: "" },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  avatar: { type: String, default: "https://i.pravatar.cc/150?img=11" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  workouts: { type: Number, default: 0 },
  activeDays: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  disciplines: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);