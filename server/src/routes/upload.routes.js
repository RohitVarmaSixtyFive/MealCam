const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middlewares/auth');
const { analyzeImage } = require('../services/geminiService');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(auth);

// POST /api/upload/image - Upload image and analyze with AI
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please upload an image file'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'biteme/meals',
          resource_type: 'auto',
          transformation: [
            { width: 1024, height: 1024, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    // Analyze image with Gemini API
    const analysisResult = await analyzeImage(uploadResult.secure_url);

    res.json({
      message: 'Image uploaded and analyzed successfully',
      imageUrl: uploadResult.secure_url,
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Upload and analyze error:', error);
    
    // Handle specific error types
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only image files are allowed'
      });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image size must be less than 10MB'
      });
    }
    
    res.status(500).json({
      error: 'Upload failed',
      message: 'Something went wrong while uploading and analyzing the image'
    });
  }
});

// POST /api/upload/analyze-url - Analyze image from URL
router.post('/analyze-url', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: 'No image URL provided',
        message: 'Please provide an image URL'
      });
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid image URL'
      });
    }

    // Analyze image with Gemini API
    const analysisResult = await analyzeImage(imageUrl);

    res.json({
      message: 'Image analyzed successfully',
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Analyze URL error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'Something went wrong while analyzing the image'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image size must be less than 10MB'
      });
    }
    return res.status(400).json({
      error: 'Upload error',
      message: error.message
    });
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files are allowed'
    });
  }
  
  next(error);
});

module.exports = router;
