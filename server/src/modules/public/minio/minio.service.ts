import { Injectable } from '@nestjs/common'

import * as Minio from 'minio'
@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: '123.207.29.109',
      port: 9000,
      useSSL: false,
      accessKey: 'frank',
      secretKey: 'WangMing1998'
    })
  }

  async uploadFile(bucketName: string, objectName: string, data: Buffer) {
    console.log(bucketName)
    console.log(objectName)
    // await this.minioClient.makeBucket('mybucket', 'us-east-1', function (err) {
    //   if (err) return console.log('Error creating bucket.', err)
    //   console.log('Bucket created successfully in "us-east-1".')
    // })
    return await this.minioClient.putObject(bucketName, objectName, data)
  }

  async getFileById(bucketName: string, objectName: string) {
    console.log(bucketName)
    console.log(objectName)
    // await this.minioClient.makeBucket('mybucket', 'us-east-1', function (err) {
    //   if (err) return console.log('Error creating bucket.', err)
    //   console.log('Bucket created successfully in "us-east-1".')
    // })
    let size = ''

    try {
      await this.minioClient.getObject(
        bucketName,
        objectName,
        (err, dataStream) => {
          if (err) {
            return console.log(err)
          }
          dataStream.on('data', function (chunk) {
            size += chunk
          })
          dataStream.on('end', function () {
            console.log('End. Total size = ' + size)
          })
          dataStream.on('error', function (err) {
            console.log(err)
          })
        }
      )
    } catch (err) {
      console.error(err)
      throw err
    }
    return size
  }

  presignedGetObject(bucketName: string, objectName: string) {
    try {
      return this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        24 * 60 * 60
      )
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

// var Minio = require('minio')
// var fs = require('fs')
// var https = require('https')

// var s3Client = new Minio.Client({
//   endPoint: 'play.min.io',
//   port: 9000,
//   useSSL: true,
//   accessKey: 'Q3AM3UQ867SPQQA43P2F',
//   secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
//   transportAgent: new https.Agent({
//     timeout: 10000,
//     ca: fs.readFileSync('path/to/ca.cert'),
//     cert: fs.readFileSync('path/to/public.cert'),
//     key: fs.readFileSync('path/to/secret.key'),
//     keepAlive: false,
//   }),
// })
