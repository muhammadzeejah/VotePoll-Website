import * as faceapi from 'face-api.js';

export async function loadModels(
    setLoadingMessage,
    setLoadingMessageError
) {
    const MODEL_URL = '/models';

    try {
        setLoadingMessage('Loading Face Detector');
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);

        setLoadingMessage('Loading 68 Facial Landmark Detector');
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);

        setLoadingMessage('Loading Feature Extractor');
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
    } catch (err) {
        setLoadingMessageError(
            'Model loading failed.'
        );
    }
}

export async function getFullFaceDescription(blob, inputSize = 512) {
    // tiny_face_detector options
    let scoreThreshold = 0.8;
    const OPTION = new faceapi.SsdMobilenetv1Options({
      inputSize,
      scoreThreshold,
    });
    const useTinyModel = true;
  
    // fetch image to api
    let img = await faceapi.fetchImage(blob);
  
    // detect all faces and generate full description from image
    // including landmark and descriptor of each face
    let fullDesc = await faceapi
      .detectAllFaces(img, OPTION)
      .withFaceLandmarks(useTinyModel)
      .withFaceDescriptors();
    return fullDesc;
  }
  
export function isFaceDetectionModelLoaded() {
    return !!faceapi.nets.ssdMobilenetv1.params;
}

export function isFeatureExtractionModelLoaded() {
    return !!faceapi.nets.faceRecognitionNet.params;
}

export function isFacialLandmarkDetectionModelLoaded() {
    return !!faceapi.nets.faceLandmark68TinyNet.params;
}


export async function createMatcher(faceProfile, threshold) {
  let labeledDescriptors = faceProfile.map((profile) => {
    let descriptorValues = profile.faceDescriptor;
    let descriptorArray = descriptorValues.map((value) => parseFloat(value.trim()));
    return new faceapi.LabeledFaceDescriptors(profile.cnic, [new Float32Array(descriptorArray)]);
  });
  let descriptorLength = labeledDescriptors[0].descriptors[0].length;

  if (labeledDescriptors.some((descriptor) => descriptor.descriptors[0].length !== descriptorLength)) {
    throw new Error('Descriptor dimensions are not consistent');
  }

  let faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, threshold);

  // Custom logic to search for a specific face descriptor
  function matchFaceDescriptor(queryDescriptor) {
    if (queryDescriptor.length !== descriptorLength) {
      throw new Error('Query descriptor has invalid dimensions');
    }
    
    let bestMatch = faceMatcher.findBestMatch(queryDescriptor);
    return {
      cnic: bestMatch._label,
      distance: bestMatch.distance
    };
  }

  // Return the matching function
  return matchFaceDescriptor;
}
