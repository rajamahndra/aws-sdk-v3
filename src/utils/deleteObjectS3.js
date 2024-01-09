const { S3Client, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = 'ap-southeast-3';

const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

async function remove(bucketName, objects) {
  const prefix = 'try-migrate/';
  const Objects = objects.map((x) => ({ Key: prefix + x }));

  console.log('Bucket : ', bucketName);
  console.log('Object : ', objects);

  const deleteObjectsParams = {
    Bucket: bucketName,
    Delete: {
      Objects,
    },
  };

  try {
    const data = await s3Client.send(new DeleteObjectsCommand(deleteObjectsParams));
    console.log('Objects deleted:', data.Deleted);
    return data;
  } catch (err) {
    console.error('Error deleting objects:', err);
    throw err;
  }
}

module.exports = { remove };
