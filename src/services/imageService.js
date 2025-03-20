import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const options = {
  maxSizeMB: 0.5,          // Max file size of 500KB
  maxWidthOrHeight: 1024,   // Resize to max 1024px
  useWebWorker: true
};

export const uploadImage = async (file, alertId) => {
  try {
    // Compress image before upload
    const compressedFile = await imageCompression(file, options);
    
    // Create reference with timestamp to avoid name conflicts
    const storageRef = ref(storage, `alerts/${alertId}_${Date.now()}`);
    
    // Upload compressed file
    const snapshot = await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
};