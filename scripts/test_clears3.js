
const AWS = require('aws-sdk');
const moment = require('moment');
const s3 = new AWS.S3();

const UPLOAD_BUCKET = process.env.BUCKET;



exports.handler = async (event) => {
    var uploadPromises = [];
    folder.files.forEach(file => {
        uploadPromises.push(s3.putObject({
            Bucket: "mybucket",
            Key: file.name,
            Body: file.data
        }).promise());
    });

    await Promise.all(uploadPromises);
    return 'exiting'
};

async function main(callback) {
    var deletePromises = [];
    const TTL = 0 * 60 * 60 * 1000 // 24 hours 
    const now = moment(new Date())
    let clearedCount = 0;
    try {
        const result = await s3.listObjectsV2({
            Bucket: UPLOAD_BUCKET,
            Delimiter: '/'
        }).promise() 
        console.log(result )
        const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
        console.log(result.Contents)
        for (let i = 0; i < result.Contents.length; i++) {
            const key = result.Contents[i].Key
            try {
                if (key.match(isoPattern) !== null) {
                    console.log('deleting...')
                    const created = moment(key.match(isoPattern)[0])
                    const difference = moment.duration(now.diff(created));
                    if (difference > TTL) {
                        deletePromises.push(s3.deleteObject({
                            Bucket: UPLOAD_BUCKET,
                            Key: key
                        }).promise())
                    }
                }
            } catch (e) {
                callback(`Error reading ${data.Contents[i].key}: ${e}`)
            }
        }
        Promise.all(deletePromises).then((results) => {
            console.log(deletePromises.length)
            callback(null, 'done')
        });
    } catch (e) {
        callback(e)
    }
}

main((err, ok) => {
    console.log(err, ok)
})