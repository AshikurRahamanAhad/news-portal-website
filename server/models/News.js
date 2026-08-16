import mongoose from 'mongoose';
import slugify from 'slugify';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A short description is required'],
      maxlength: 300,
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    // Either an uploaded image (stored as a data URL) or a pasted image link.
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Politics',
        'World',
        'Business',
        'Technology',
        'Sports',
        'Entertainment',
        'Science',
        'Health',
      ],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

newsSchema.index({ title: 'text', description: 'text', content: 'text' });

// Auto-generate a unique slug from the title
newsSchema.pre('validate', async function (next) {
  if (!this.isModified('title')) return next();

  const base = slugify(this.title, { lower: true, strict: true });
  let candidate = base;
  let counter = 1;

  const NewsModel = this.constructor;
  while (await NewsModel.findOne({ slug: candidate, _id: { $ne: this._id } })) {
    candidate = `${base}-${counter++}`;
  }

  this.slug = candidate;
  next();
});

export default mongoose.model('News', newsSchema);
