require('dotenv').config();
const { RekognitionClient, SearchFacesByImageCommand } = require('@aws-sdk/client-rekognition');

var rekognition = new RekognitionClient({ region: 'ap-southeast-1' });

const { AWS_COLLECTION_ID } = process.env;

const searchFace = async (image) => {
  let input = {
    CollectionId: AWS_COLLECTION_ID,
    FaceMatchThreshold: 95,
    Image: {
      Bytes: image,
    },
  };

  try {
    const searchImage = new SearchFacesByImageCommand(input);
    const result = await rekognition.send(searchImage);

    if (!result) {
      return false;
    }
    if (Object.keys(result.FaceMatches).length > 0) {
      console.log('result');
      console.log(result.FaceMatches[0].Face);
      return result.FaceMatches[0].Face;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  searchFace,
};
