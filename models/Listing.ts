import mongoose from 'mongoose'

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'published', 'archived', 'rejected'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
    },
    listingType: {
      type: String,
      trim: true,
    },
    address: {
      line1: { type: String, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, trim: true },
      region: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    contact: {
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      website: { type: String, trim: true },
      inquiryUrl: { type: String, trim: true },
    },
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      canonicalUrl: { type: String, trim: true },
      socialImage: { type: String, trim: true },
    },
    media: {
      logo: { type: String, trim: true },
      coverImage: { type: String, trim: true },
      gallery: [{ type: String, trim: true }],
      attachments: [{ type: String, trim: true }],
    },
    contentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentType',
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: Date,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

ListingSchema.index({ title: 'text', description: 'text', excerpt: 'text' })

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema)