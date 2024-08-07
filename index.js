const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('./db/Product');
const axios = require('axios');
require('./db/config');

const app = express();

app.use(express.json());
app.use(cors());

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dhjdvfk3t',
    api_key: '383646353243778',
    api_secret: '8OfXx5QL4_CQOu561_P63HOR6g8'
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/',async(req,resp)=>{
    resp.send("welcome to Roamrover, Backend is Running")
})

app.post('/api/package', upload.single('image'), async (req, res) => {
    try {
        const { name, price, date, details } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'products' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(file.buffer); // Use file.buffer with memoryStorage
        });

        // Create new product document
        const product = new Product({
            name,
            price,
            date,
            details,
            imageUrl: uploadResponse.secure_url,
        });

        // Save product to database
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create package' });
    }
});

app.get("/package",async(req,resp)=>{
   let product = await Product.find();
        if (product.length > 0) {
        resp.send(product);
    } else {
        resp.send({ result: "No Package found" });
    }
})

app.get("/package/:id",async(req,resp)=>{
    let _id = req.params.id;
    if(_id.length < 24){
        return resp.json({httpCode : 400 , error: 'Error Not Found'})
    }
    const result = await Product.findOne({_id});
    if(result){
        resp.send(result);
    }
    else {
        resp.send({result : "not found"})
    }
})

const apiKey = 'AIzaSyCHDrGJPaqRzCXH7JrfiJEYdyqiKYnRbnk';

app.get('/distance', async (req, res) => {
  const { origin, destination } = req.query;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/geocode', async (req, res) => {
  const { address } = req.query;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/directions', async (req, res) => {
  const { origin, destination } = req.query;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
