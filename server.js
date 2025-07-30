const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});
