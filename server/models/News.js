import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true 
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'] 
    },
    category: { 
      type: String, 
      required: true, 
      default: 'General' 
    },
    imageUrl: { 
      type: String, 
      required: [true, 'Image URL is required'] 
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

export default mongoose.model('News', newsSchema);