const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // 1. Basic Information
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  type: { type: String, required: true }, // e.g. Villa, Apartment, Plot
  purpose: { type: String, required: true }, // Sale, Rent
  status: { type: String, required: true, default: 'Available' }, // Available, Sold, Rented, Upcoming

  // 2. Pricing Details
  pricing: {
    price: { type: String, required: true },
    offerPrice: { type: String },
    pricePerSqFt: { type: String },
    maintenanceCharges: { type: String }
  },

  // 3. Location Details
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    fullAddress: { type: String, required: true },
    pincode: { type: String },
    googleMapLink: { type: String }
  },

  // 4. Property Specifications
  specifications: {
    totalArea: { type: String },
    builtUpArea: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    balconies: { type: String },
    floors: { type: String },
    parkingSpaces: { type: String },
    facing: { type: String } // East, West, North, South
  },

  // 5. Amenities
  amenities: [String],

  // 6. Property Images
  images: {
    featured: { type: String, required: true },
    gallery: [String],
    videoUrl: { type: String }
  },

  // 7. Property Description
  description: {
    short: { type: String, required: true },
    full: { type: String, required: true }
  },

  // 8. Property Highlights
  highlights: {
    readyToMove: { type: Boolean, default: false },
    newLaunch: { type: Boolean, default: false },
    premiumProperty: { type: Boolean, default: false },
    featuredProperty: { type: Boolean, default: false },
    hotProperty: { type: Boolean, default: false }
  },

  // 9. Agent Details
  agent: {
    name: { type: String },
    mobile: { type: String },
    email: { type: String }
  },

  // 10. SEO (Optional)
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String }
  }

}, { timestamps: true });

// Pre-save hook to generate slug if not provided manually
propertySchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
