import mongoose from 'mongoose';

const SpecSchema = new mongoose.Schema({
  businessType: {
    type: String,
    required: true,
  },
  platformType: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
}); 