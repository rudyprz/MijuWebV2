// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var os  = require('os');
var express = require('express');
var path    = require('path')
var ParseServer = require('parse-server').ParseServer;
var GCSAdapter = require('parse-server-gcs-adapter');
var SimpleSendGridAdapter = require('parse-server-sendgrid-adapter');
var ParseDashboard = require('parse-dashboard');
var pug                   = require('pug');
var bodyParser            = require('body-parser');
var favicon               = require('serve-favicon');
var session               = require('express-session');

//Routes
var main  = require('./routes/main');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;


if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

APP_ID = 'BrounieApp';
MASTER_KEY = "C4suYZKkyRMYPGR7fEae";
APP_NAME = "Museo MIJU";
serverURL = "https://museomiju.com/parse";

TAG = APP_ID + ":" + os.hostname();
var dd_options = {
  'response_code':true,
  'tags': [TAG]
}

var gcsAdapter = new GCSAdapter(
   "parse-server",
    "key.json",
    "museo-miju", {
    bucketPrefix: 'miju_',
    directAccess: true}
);

var connect_datadog = require('connect-datadog')(dd_options);
var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || APP_ID,
  masterKey: process.env.MASTER_KEY || MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || serverURL,  // Don't forget to change to https if needed
  filesAdapter: gcsAdapter,
  sessionLength : 31536000 * 2, // 1 Year in seconds
  verbose : false,
  emailAdapter: {
         module: 'parse-server-simple-mailgun-adapter',
         options: {
           // The address that your emails come from
           fromAddress: 'robot@brounieapps.com',
           // Your domain from mailgun.com
           domain: 'brounieapps.com',
           // Your API key from mailgun.com
           apiKey: 'key-f34136558bac453323e9067ad1905012',
         }
  }

});

var allowInsecureHTTP = true;

var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": serverURL,
      "appId": APP_ID,
      "masterKey": MASTER_KEY,
      "appName": APP_NAME
    },
  ],
  "users": [
      {
        "user":"admin",
        "pass":"cliente"
      }
    ]
},allowInsecureHTTP);

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.locals.moment = require("moment");
app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(connect_datadog);
app.use(mountPath, api);
app.enabled('trust proxy')

//Session init
var sessionTime = 3600000 //1 hour

app.use(session({
  cookie: { maxAge: sessionTime },
  resave: true,
  saveUninitialized: false,
  secret: 'PGSecret'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(favicon(path.join(__dirname, 'public/img', 'miju.png')));
//app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(favicon(path.join(__dirname, 'public/img', 'Grupo333.svg')))


app.use('/', main);

// Parse Server plays nicely with the rest of your web routes
// app.get('/', function(req, res) {
//   res.status(200).send('I dream of being a web site.');
// });

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
