const express = require('express')
const multer  = require('multer')
const docxConverter = require('docx-pdf');
const path = require('path');


const app = express()
const port = 3000


// storage created Here
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('/profile', upload.single('file'),  (req, res, next) => {
  try {


    if(!req.file) {
      return res.status(400).json({
        message: "No File uploaded"
     })
    }

    // defining output file path

    let outputPath = path.join(__dirname, "files", `$(req.file.originalname).pdf`)

    docxConverter(req.file.path, outputPath, (err,result) => {

      if(err){
        console.log(err);
        return res.status(500).json({
          message: "error converting docx to pdf",
        })
      }
      res.download(outputPath, () => {
        console.log("flie downloaded")
      })
      console.log('result'+result);
    });
  } catch (error) {
    console.log(error)
    res.status(500).json ({
      message: "Internal Server error",
    });
  }
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})