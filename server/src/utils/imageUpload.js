const cloudinary = require('../config/cloudinary');

/**
 * Upload an image to Cloudinary
 * @param {Object} fileBuffer - The file buffer to upload
 * @param {String} folder - The folder to upload to in Cloudinary (optional)
 * @returns {Promise<Object>} - The upload result with URL and public ID
 */
const uploadImage = async (fileBuffer, folder = 'orders') => {
  try {
    // Convert the buffer to a base64 encoded string
    const fileStr = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: 'image',
    });
    
    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete an image from Cloudinary
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - The deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = {
  uploadImage,
  deleteImage,
}; 