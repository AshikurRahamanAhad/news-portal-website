import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    avatar: { 
      type: String, 
      default: 'https://i.ibb.co/MBtjqXQ/no-avatar.png' 
    },
    bio: { 
      type: String, 
      default: 'News enthusiast' 
    },
    role: { 
      type: String, 
      enum: ['User', 'Reporter', 'Admin'], 
      default: 'Reporter' 
    },
    // Array of saved news article IDs (Private to the user)
    savedNews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);