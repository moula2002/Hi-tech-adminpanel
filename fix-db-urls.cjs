require('dotenv').config();
const mongoose = require('mongoose');

// Define generic models dynamically to avoid strict schema constraints
const dbUri = "mongodb+srv://hitechestatesjj_db_user:GaJLOghVP7rYuSAa@cluster0.bwkomwo.mongodb.net/HITechestates?retryWrites=true&w=majority";
const oldStr = 'http://localhost:5000';
const newStr = 'https://hi-techserver-zd1d.onrender.com';

async function fixUrls() {
  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB.');

    const db = mongoose.connection.db;

    // Fix Banners
    console.log('Fixing banners...');
    const banners = await db.collection('banners').find({ image: { $regex: oldStr } }).toArray();
    for (let b of banners) {
      await db.collection('banners').updateOne({ _id: b._id }, { $set: { image: b.image.replace(oldStr, newStr) } });
    }
    console.log(`Fixed ${banners.length} banners.`);

    // Fix Categories
    console.log('Fixing categories...');
    const categories = await db.collection('categories').find({ image: { $regex: oldStr } }).toArray();
    for (let c of categories) {
      await db.collection('categories').updateOne({ _id: c._id }, { $set: { image: c.image.replace(oldStr, newStr) } });
    }
    console.log(`Fixed ${categories.length} categories.`);

    // Fix Properties
    console.log('Fixing properties...');
    const properties = await db.collection('properties').find({ 
      $or: [
        { 'images.featured': { $regex: oldStr } },
        { 'images.gallery': { $regex: oldStr } }
      ]
    }).toArray();
    
    for (let p of properties) {
      let update = {};
      if (p.images && p.images.featured && p.images.featured.includes(oldStr)) {
        update['images.featured'] = p.images.featured.replace(oldStr, newStr);
      }
      if (p.images && p.images.gallery) {
        update['images.gallery'] = p.images.gallery.map(img => typeof img === 'string' && img.includes(oldStr) ? img.replace(oldStr, newStr) : img);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('properties').updateOne({ _id: p._id }, { $set: update });
      }
    }
    console.log(`Fixed ${properties.length} properties.`);
    
    console.log('All done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixUrls();
