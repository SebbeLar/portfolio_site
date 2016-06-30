var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    nodemailer = require('nodemailer'),
    mail =  process.env.MAIL || require('./mail'),
    app = express();

var root = __dirname;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.static(path.join(root + '/public/')));
app.use(express.static(path.join(root + '/images/')));

app.get('/', function(req, res) {
    res.sendFile(path.join(root + '/index.html'));
});

app.get('/api', function(req, res) {
    res.download(path.join(root + '/public/downloads/cv.pdf'));
});

app.post('/contact', function (req, res) {
    var mailOpts, 
        smtpTrans;
    
    smtpTrans = nodemailer.createTransport(mail);
    console.log(req.body);
    mailOpts = {
        from: req.body.email, 
        to: 'sebberlarsson@hotmail.com',
        subject: 'Portfolio contact form from ' + req.body.email + ' as ' + req.body.name,
        text: req.body.message
    };
    smtpTrans.sendMail(mailOpts, function (err) {
        if (err) {
            console.log('Something went wrong!');
        }
        else {
            console.log('Email sent!');
            res.redirect('/#contact');
        }
    });
});

var PORT = process.env.PORT || 8081;

app.listen(PORT, process.env.IP, function() {
    console.log('Server listening on port ' + PORT);
}); 