const mongoose = require('mongoose');

// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });  

// useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major versio

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
