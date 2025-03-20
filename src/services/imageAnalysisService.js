import { getFirestore, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { DISASTER_CATEGORIES } from '../config/disasterCategories';

export const analyzeStoredImages = async () => {
  const db = getFirestore();
  const alertsRef = collection(db, 'alerts');
  const unanalyzedQuery = query(alertsRef, where('analyzed', '==', false));

  try {
    const snapshot = await getDocs(unanalyzedQuery);
    
    for (const doc of snapshot.docs) {
      const alert = doc.data();
      
      // Load TensorFlow model
      const model = await window.mobilenet.load();
      
      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = alert.imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Convert image to tensor
            const tensor = window.tf.browser.fromPixels(img);
            const predictions = await model.classify(tensor);
            tensor.dispose();

            const predictedLabels = predictions.map(p => p.className.toLowerCase());
            const keywords = DISASTER_CATEGORIES[alert.category]
              ?.find(i => i.value === alert.incidentType)?.keywords || [];

            // Check if image matches incident type
            const isValid = keywords.some(keyword =>
              predictedLabels.some(label => label.includes(keyword))
            );

            if (!isValid) {
              // Delete invalid alert
              await deleteDoc(doc.ref);
              console.log(`Deleted invalid alert: ${doc.id}`);
            } else {
              // Mark as analyzed
              await updateDoc(doc.ref, {
                analyzed: true,
                aiVerified: true,
                detectedContent: predictedLabels.slice(0, 3)
              });
            }
          } catch (error) {
            console.error('Error analyzing image:', error);
          }
          resolve();
        };
        img.onerror = reject;
      });
    }
  } catch (error) {
    console.error('Error in image analysis service:', error);
  }
};