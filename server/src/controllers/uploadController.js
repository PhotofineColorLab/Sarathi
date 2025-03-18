const { uploadImage, deleteImage } = require('../utils/imageUpload');

/**
 * Upload an image to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadOrderImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file uploaded' 
      });
    }

    const imageFile = req.files.image;
    
    // Check file type
    if (!imageFile.mimetype.startsWith('image')) {
      return res.status(400).json({ 
        success: false, 
        message: 'File must be an image' 
      });
    }
    
    // Check file size (limit to 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (imageFile.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image size must be less than 2MB' 
      });
    }
    
    // Upload image to Cloudinary
    const uploadResult = await uploadImage(imageFile.data, 'orders');
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId
      }
    });
  } catch (error) {
    console.error('Upload controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};

/**
 * Delete an image from Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteOrderImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }
    
    // Delete the image from Cloudinary
    const result = await deleteImage(publicId);
    
    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
};

module.exports = {
  uploadOrderImage,
  deleteOrderImage
}; 