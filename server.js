  let express = require('express')
  // path = require('path'),
  nodemailer = require('nodemailer'),
  bodyParser = require('body-parser')
  // smtpTransport = require('nodemailer-smtp-transport');

  //Express app
  let app = express()

  //FS - To access files

  const fs = require('fs');
  const { promisify } = require('util');
  const readFile = promisify(fs.readFile);

  app.set('view engine', 'ejs');
  app.use(express.static('public'));

  //Body parser - for middleware 
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  //port
  let port = 3000;
  
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/send-email',   async function (req, res) {
      let transporter =  nodemailer.createTransport({
        pool: true,
        host: 'smtp.gmail.com',
        port:465,
        secure: true, 
        auth: {
          user: 'liranuzistud@gmail.com',
          pass:'token'                   //This is the token from google access from https://myaccount.google.com/apppasswords?rapt=AEjHL4Nb54F7EHHwDyQ-vdIqdjHYQDIoLSbR0wWCyDy3-hjdk0xLeDyIc7dYi0Bd4jOCHkmM2zIu3yguF-XQKvvkDhjh9jfDYA
          },                                        //name : אימייל ב-מחשב Windows שלי ixhwhysexlojcqds
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
          },
      })
        let mailOptions = {
          to: req.body.to,
          subject: req.body.subject,
          text: req.body.body,
          html: await readFile('./views/index.ejs', 'utf8')
        };
        
        transporter.sendMail(mailOptions,  function(error, info){

          if(!mailOptions.to.trim())
          res.status(404).send({message:'You Must Enter email to send'})

          if(!mailOptions.subject.trim())
          res.status(404).send({message:'You Must Enter subject'})

          if(!mailOptions.text.trim())
          res.status(404).send({message:'You Must Enter text'})

          if (error) 
            res.status(500).send({message:{error}})
          else 
            res.status(200).send({message:{mailOptions}})
          })
      });

    app.listen(port, function(){
      console.log('Server is running at port: ',port);
    });