const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const storage = new Storage({
  projectId: 'kuma-capstone', 
  keyFilename: './config/serviceaccountkey.json', // Replace with the path to your service account key file
});

const bucket = storage.bucket('kuma-profile-image'); 

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (adjust as needed)
  },
});

const uploadImage = upload.single('image');

const storeImage = async (req, res) => {
  const { userId } = req.body;
  const image = req.file;

  if (!image) {
    res.status(400).send({ error: true, message: 'No image file provided' });
    return;
  }

  try {
    const fileName = `images/${userId}_${Date.now()}_${image.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Error uploading image:', err);
      res.status(500).send({ error: true, message: 'Failed to upload image' });
    });

    stream.on('finish', () => {
      res.status(200).send({ error: false, message: 'Image uploaded successfully' });
    });

    stream.end(image.buffer);
  } catch (err) {
    console.error('Error storing image:', err);
    res.status(500).send({ error: true, message: 'Failed to store image' });
  }
}; 

module.exports = {
    uploadImage,
    storeImage
}
