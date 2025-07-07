const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
  /**
   * Upload an image buffer to Cloudinary
   * @param {Buffer} imageBuffer - The image buffer to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Cloudinary upload result
   */
  async uploadImage(imageBuffer, options = {}) {
    try {
      const defaultOptions = {
        folder: 'biteme/meals',
        resource_type: 'auto',
        transformation: [
          { width: 1024, height: 1024, crop: 'limit' },
          { quality: 'auto' }
        ],
        ...options
      };

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          defaultOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(imageBuffer);
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param {string} publicId - The public ID of the image to delete
   * @returns {Promise<Object>} - Cloudinary deletion result
   */
  async deleteImage(publicId) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw error;
    }
  }

  /**
   * Get optimized image URL
   * @param {string} publicId - The public ID of the image
   * @param {Object} transformations - Image transformations
   * @returns {string} - Optimized image URL
   */
  getOptimizedUrl(publicId, transformations = {}) {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations
    };

    return cloudinary.url(publicId, defaultTransformations);
  }

  /**
   * Generate thumbnail URL
   * @param {string} publicId - The public ID of the image
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {string} - Thumbnail URL
   */
  getThumbnailUrl(publicId, width = 200, height = 200) {
    return cloudinary.url(publicId, {
      width: width,
      height: height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param {string} url - Cloudinary URL
   * @returns {string} - Public ID
   */
  extractPublicId(url) {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return filename.split('.')[0];
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
}

// Export singleton instance
const cloudinaryService = new CloudinaryService();

module.exports = {
  uploadImage: (imageBuffer, options) => cloudinaryService.uploadImage(imageBuffer, options),
  deleteImage: (publicId) => cloudinaryService.deleteImage(publicId),
  getOptimizedUrl: (publicId, transformations) => cloudinaryService.getOptimizedUrl(publicId, transformations),
  getThumbnailUrl: (publicId, width, height) => cloudinaryService.getThumbnailUrl(publicId, width, height),
  extractPublicId: (url) => cloudinaryService.extractPublicId(url)
};
