const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Admin = require('./models/Admin');
const Property = require('./models/Property');
const Enquiry = require('./models/Enquiry');
const Category = require('./models/Category');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Uploads Directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save to server/uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded files staticly

// Database Connection
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas!');

    // Seed default admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('No admin found, creating default admin account...');
      await new Admin({ email: 'admin@hitech.com', password: 'admin123' }).save();
    }

    // Mock data seeding removed

    // Default category seeding removed
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// ================= ROUTES =================

// Basic health check
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', message: 'Hi-Tech Admin API is online.' });
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Admin Profile
app.get('/api/admin/profile', async (req, res) => {
  try {
    const admin = await Admin.findOne(); // For now, just grab the first admin
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ id: admin._id, email: admin.email, name: admin.name, phone: admin.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/admin/profile', async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Update fields
    if (req.body.name) admin.name = req.body.name;
    if (req.body.email) admin.email = req.body.email;
    if (req.body.phone) admin.phone = req.body.phone;
    if (req.body.password) admin.password = req.body.password; // In real app, hash this!

    await admin.save();
    res.json({ message: 'Profile updated successfully', admin: { name: admin.name, email: admin.email, phone: admin.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PROPERTIES API
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    const mapped = properties.map(p => ({
      ...p._doc,
      id: p._id.toString()
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/properties', upload.fields([{ name: 'featuredImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]), async (req, res) => {
  try {
    let propertyData = {};
    if (req.body.data) {
      propertyData = JSON.parse(req.body.data);
    } else {
      propertyData = req.body; // Fallback if sent as standard JSON (without files)
    }

    if (!propertyData.images) {
      propertyData.images = {};
    }

    // Assign featured image
    if (req.files && req.files['featuredImage']) {
      propertyData.images.featured = 'https://hi-techserver-zd1d.onrender.com/uploads/' + req.files['featuredImage'][0].filename;
    }

    // Assign gallery images
    if (req.files && req.files['galleryImages']) {
      const galleryUrls = req.files['galleryImages'].map(f => 'https://hi-techserver-zd1d.onrender.com/uploads/' + f.filename);
      propertyData.images.gallery = galleryUrls;
    }

    const newProp = new Property(propertyData);
    await newProp.save();
    res.status(201).json({ ...newProp._doc, id: newProp._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/properties/:id', upload.fields([{ name: 'featuredImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]), async (req, res) => {
  try {
    let propertyData = {};
    if (req.body.data) {
      propertyData = JSON.parse(req.body.data);
    } else {
      propertyData = req.body;
    }

    if (!propertyData.images) {
      propertyData.images = {};
    }

    if (req.files && req.files['featuredImage']) {
      propertyData.images.featured = 'https://hi-techserver-zd1d.onrender.com/uploads/' + req.files['featuredImage'][0].filename;
    }

    if (req.files && req.files['galleryImages']) {
      const galleryUrls = req.files['galleryImages'].map(f => 'https://hi-techserver-zd1d.onrender.com/uploads/' + f.filename);
      propertyData.images.gallery = propertyData.images.gallery && propertyData.images.gallery.length > 0
        ? [...propertyData.images.gallery, ...galleryUrls]
        : galleryUrls;
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, propertyData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Property not found' });
    res.json({ ...updated._doc, id: updated._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ENQUIRIES API
app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate('propertyId', 'title slug').sort({ createdAt: -1 });
    const mapped = enquiries.map(e => ({
      ...e._doc,
      id: e._id.toString(),
      date: new Date(e.createdAt).toLocaleDateString() // formatting date
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, email, phone, message, propertyId, interestedIn, formSource } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      interestedIn,
      formSource,
      propertyId: propertyId || undefined
    });

    await newEnquiry.save();
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: newEnquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/enquiries/:id', async (req, res) => {
  try {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ ...updated._doc, id: updated._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CATEGORIES API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    const mapped = categories.map(c => ({
      ...c._doc,
      id: c._id.toString()
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/categories', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), async (req, res) => {
  try {
    const categoryData = { ...req.body };

    // Parse SEO object if sent as string from formData
    if (typeof categoryData.seo === 'string') {
      try {
        categoryData.seo = JSON.parse(categoryData.seo);
      } catch (e) {
        // ignore
      }
    }

    // Handle booleans from formData string
    categoryData.showOnHome = categoryData.showOnHome === 'true';
    categoryData.featured = categoryData.featured === 'true';

    // Assign file paths if uploaded
    if (req.files && req.files['image']) {
      categoryData.image = 'https://hi-techserver-zd1d.onrender.com/uploads/' + req.files['image'][0].filename;
    }
    if (req.files && req.files['icon']) {
      categoryData.icon = 'https://hi-techserver-zd1d.onrender.com/uploads/' + req.files['icon'][0].filename;
    }

    const newCategory = new Category(categoryData);
    await newCategory.save();
    res.status(201).json({ ...newCategory._doc, id: newCategory._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Category validation failed or name must be unique' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DASHBOARD STATS API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const propertyCount = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'Active' });
    const enquiryCount = await Enquiry.countDocuments();
    const unreadEnquiries = await Enquiry.countDocuments({ status: 'unread' });

    res.json({
      propertyCount,
      activeProperties,
      enquiryCount,
      unreadEnquiries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
