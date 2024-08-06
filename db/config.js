const mongoose=require('mongoose');
// mongoose.connect("mongodb://localhost:27017/Mernlogin");

mongoose.connect('mongodb+srv://steevenrajsr23:0000@simpledb.damfabm.mongodb.net/?retryWrites=true&w=majority&appName=SimpleDB')
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });