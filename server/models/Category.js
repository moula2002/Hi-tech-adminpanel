const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  image: { type: String, required: true },
  icon: { type: String },
  description: { type: String },
  shortDescription: { type: String },
  showOnHome: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String }
  }
}, { timestamps: true });

// Pre-save hook to generate slug if not provided manually
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
