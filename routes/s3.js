var express = require('express');
var router = express.Router();
var s3 = require('@aws-sdk/client-s3');

const { ListBucketsCommand } = require('@aws-sdk/client-s3');
const s3Client = new s3.S3Client({region: "us-east-1"});

var fileUpload = require('express-fileupload');
router.use(fileUpload());

/* GET LIST OF BUCKETS */
router.get('/', async function(req, res) {
  try {
    let data = await s3Client.send(new ListBucketsCommand({}));
    res.render('listBuckets', {buckets: data.Buckets})
  } catch(err) {
    res.render('error', {error: err});
  }
});

router.get('/:bucket/', async function(req, res) {
  /*
   * @TODO - Programa la logica para obtener los objetos de un bucket.
   *         Se debe tambien generar una nueblo templade en jade para presentar
   *         esta información. Similar al que lista los Buckets.
   * 
   *         El nombre del bucket lo recibimos en req.params.bucket
   */

});

router.get('/:bucket/:key', async function(req, res) {
  
  /*
   * @TODO - Programa la logica para obtener un objeto en especifico
   * es importante a la salida enviar el tipo de respuesta y el contenido
   * el cual nos llegara como un Buffer.
   * 
   * Ejemplo de esto:
   *     res.type(...) --> Enviar el elemento ContentType de la respuesta.
   *     
   *     El elemento Body de la respueta en si es un stream, por lo que debemos
   *     enviarlo de la siguiente forma:
   * 
   *     bodyStream.on("data", (chunk) => res.write(chunk));
   *     bodyStream.once("end", () => {
   *           res.end();
   *      });
   *      bodyStream.once("error", () => {
   *           res.end();
   *      });
   *      
   */    

});


router.post('/', async function(req,res) {
  /*
   * @TODO - Programa la logica para crear un Bucket.
   *
   * La información que es enviada el CUERPO del post se recibe en req.body
   */ 
});

router.post('/:bucket', async function(req,res) {

  /*
   * @TODO - Programa la logica para crear un nuevo objeto.
   * TIPS:
   *  req.files contiene todo los archivos enviados mediante post.
   *  cada elemento de files contiene multiple información algunos campos
   *  importanets son:
   *      data -> Buffer con los datos del archivo.
   *      name -> Nombre del archivo original
   *      mimetype -> tipo de archivo.
   *  el conjunto files dentro del req es generado por el modulo 
   *  express-fileupload
   * 
   *  El comando PutObjectCommand requiere un STREAM para recibir un archivo
   *  para convertir el Buffer que nos llega a un stream se puede usar lo
   *  siguiente:
   * 
   *  const {Readable} = require("stream");
   *  Readable.from(buffer.toString());
  */
   
});

module.exports = router;
