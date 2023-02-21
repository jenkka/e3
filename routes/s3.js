var express = require('express');
var router = express.Router();
var s3 = require('@aws-sdk/client-s3');

const { ListBucketsCommand, ListObjectsCommand, GetObjectCommand, CreateBucketCommand, S3LocationFilterSensitiveLog, PutObjectCommand, PutObjectLockConfigurationCommand, NoSuchKey } = require('@aws-sdk/client-s3');
const s3Client = new s3.S3Client({region: "us-east-1"});

var fileUpload = require('express-fileupload');
router.use(fileUpload());

router.get('/', async function(req, res) {
  try {
    let data = await s3Client.send(new ListBucketsCommand({}));
    res.render('listBuckets', {buckets: data.Buckets})
  } catch(err) {
    res.render('error', {error: err});
  }
});

router.get('/:bucket/', async function(req, res) {
  try {
    let params = {
      Bucket: req.params.bucket
    }

    let data = await s3Client.send(new ListObjectsCommand(params));
    res.render('listObjects', {bucketName: req.params.bucket, objects: data.Contents})
  } catch (err) {
    res.render('error', {error: err})
  }
});

router.get('/:bucket/:key', async function(req, res) {
  try {
    const params = {
      Bucket: req.params.bucket,
      Key: req.params.key
    };

    const data = await s3Client.send(new GetObjectCommand(params));
    res.type(data.ContentType);
    data.Body.once('error', err => reject(err));
    data.Body.on('data', data => res.write(data));
    data.Body.once('end', () => res.end());

  } catch (err) {
    console.log("Error", err);
  }
});


router.post('/', async function(req,res) {
  let params = {
    Bucket: req.body.Bucket
  }

  try {
    const data = await s3Client.send(new CreateBucketCommand(params));
    console.log("The bucket " + req.body.Bucket + " has been created.");
    return data;
  } catch (err) {
    console.log("Error", err);
  }
});

router.post('/:bucket', async function(req,res) {  
  try {
    const {Readable} = require('stream');

    req.files.file.forEach(async e => {
      const readable = Readable.from(e.data.toString());
      
      // Check if file already exists
      let count = 0;
      let success = false;
      let fileName = e.name;

      do {
        if (count > 0) {
          fileName = count + "-" + e.name
        }

        const eParams = {
          Bucket: req.params.bucket,
          Key: fileName
        }

        try {
          await s3Client.send(new GetObjectCommand(eParams));
          console.log("Searching for another file name")
          count++;
        } catch (e) {
          success = true;
        }
      } while (success == false);
      
      // Upload file
      const params = {
        Bucket: req.params.bucket,
        Key: fileName,
        Body: readable,
        ContentType: e.mimetype,
        ContentLength: e.data.length
      }
      await s3Client.send(new PutObjectCommand(params));

      console.log(
        "Successfully uploaded object: " +
          params.Bucket +
          "/" +
          params.Key
      );
    });
  } catch (err) {
    console.log("Error", err);
  }

  res.status(200);
  res.send("Done");
});

module.exports = router;
