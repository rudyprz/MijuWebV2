var express     = require('express');
var Parse       = require("parse/node");
var Mailgunny   = require('mailgunny');

var router      = express.Router();

var User = Parse.Object.extend("User");
var PhotosEvent = Parse.Object.extend("PhotosEvent");
var Newsletter = Parse.Object.extend("Newsletter");
var Relative = Parse.Object.extend("Relative");

var functions = {
  photos: function (req, res, next) {

    if(req.session.mail){
      context = {
        name: req.session.name, 
        id: req.session.mail
      };
  
      var photosQuery = new Parse.Query(PhotosEvent);
      photosQuery.equalTo("email", req.session.mail);
      photosQuery.equalTo("hidden", false);
      photosQuery.find({
        success: function(photos){
          // console.log(photos.length + " photos found.");
          context.photos = photos;
          res.render('user/recuerdos', context);
        },
        error: function(error){
          res.send(error);
        }
      });
    }
    else{
      console.log("Sesión no iniciada");
      res.redirect("/login");
    }
    
  },
  signIn: function(req, res, next){
    var context = {};
    Parse.User.logIn(req.body.username, req.body.password, {
      success: function(user) {
        req.session.user = user;
        req.session.name = user.get("name");
        req.session.mail = user.get("username");

        context = {name: req.session.name, id: req.session.mail};
        var query = new Parse.Query(PhotosEvent);
        query.equalTo("email", req.session.mail);
        query.equalTo("hidden", false);
        query.find({
          success: function(photos){
            context.photos = photos;
            //console.log(photos);
            res.render('user/recuerdos', context);
          },
          error: function(error){
            res.send(error);
          }
        });
      },
      error: function(user, error) {
        context = {error: "Usuario/Contraseña incorrectos. Intenta de nuevo por favor."};
        console.log(context);
        console.log("ERROR",error);
        console.log("ERROR",error.message);
        console.log("ERROR",error.code);
        res.render('user/login', context);
      }
    });
  },
  signInAdmin: function(req, res, next){
    var context = {};
    Parse.User.logIn(req.body.username, req.body.password, {
      success: function(user) {
        req.session.user = user;
        //console.log(req.session.user);
        req.session.name = user.get("name");
        req.session.pass = user.get("pass");
        // Do stuff after successful login.
        //context = {name: req.session.name};
        res.send({status:"success",type:"admin"});
      },
      error: function(user, error) {
        context = {error: "Usuario/Contraseña incorrectos. Intenta de nuevo por favor."};
        console.log(context);
        console.log("ERROR",error);
        console.log("ERROR",error.message);
        console.log("ERROR",error.code);
        res.send(false);
      }
    });
  },
  code: function(req, res, next){
    console.log("Entra a función");
    
    var context = {};
    var mailQuery = new Parse.Query(PhotosEvent);
    mailQuery.get(req.body.code,{
      success: function(photo){
        console.log("PhotoEvent found. ObjectId: " + photo.id);
        console.log(photo.get('email'));
        context.mail = photo.get('email');
        res.render('user/reg', context);
      },
      error: function(error){
        res.send(error);
      }
    });  
  },
  sendQuote: function(req, res, next){

    var name = req.body.quoteName;
    var mailAddress = req.body.quoteMail;

    //Quote data
    var lastname = req.body.quoteLName;
    var phone = req.body.quotePhone;
    var comments = req.body.quoteComments;

    // Contact email
    var emailTo = ['artemio.abrego@mentesexpertas.mx', 'nadia.sanchez@mentesexpertas.mx', 'artemio@drbrand.mx'];
    // var emailTo = ['eduardo.vera.pineda@gmail.com'];
    
    var html = `
      <html>
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Sisamex</title>
          <link href="/css/aux.css" rel="stylesheet"/>
        </head>
        <div class="main-content" id="content" style="width:70%;margin:auto">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tbody>
              <tr>
                <td align="center" bgcolor="#FFB52E" style="padding: 40px 0 30px 0;"><img src="https://museomiju.com/img/Grupo1@2x.png" alt="Miju" style="display: block; witdth:100%"/></td>
              </tr>
              <tr>
                <td align="center" bgcolor="#fff">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tbody>
                      <tr style="padding:10px">
                        <td align="center" bgcolor="#f8f8f8" style="padding: 40px 0 30px 0;" colspan="2">¡Tenemos un nuevo prospecto!</td>
                      </tr>
                      <tr style="padding:10px">
                        <td style="width:40%;padding:10px;text-align:right">Nombre:</td>
                        <td style="width:60%;padding:10px"><b>${name} ${lastname}</b></td>
                      </tr>
                      <tr style="padding:10px">
                        <td style="width:40%;padding:10px;text-align:right">Correo:</td>
                        <td style="width:60%;padding:10px"><b>${mailAddress}</b></td>
                      </tr>
                      <tr style="padding:10px">
                        <td style="width:40%;padding:10px;text-align:right">Teléfono:</td>
                        <td style="width:60%;padding:10px"><b>${phone}</b></td>
                      </tr>
                      <tr style="padding:10px">
                        <td style="width:40%;padding:10px;text-align:right">Comentarios:</td>
                        <td style="width:60%;padding:10px"><b>${comments}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#00a65f" style="padding: 20px 0; color:white">
                  <p>Museo Interactivo del Juguete</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </html>
    `;

    var mail = new Mailgunny({domain: 'brounieapps.com', key: 'key-f34136558bac453323e9067ad1905012'});
    
    mail.send({
      from: "contacto@museomiju.com",
      to: emailTo,
      subject: 'MIJU | ¡Hay un nuevo prospecto!',
      html: html
    }, function(reque, resp){
      console.log('Email to Miju('+ emailTo +') was sent.');
    });

    res.redirect('/');
  },
  sendQuote2: function(req, res, next){
    var mail = new Mailgunny({
      domain: 'brounieapps.com',
      key: 'key-f34136558bac453323e9067ad1905012'
    });

    var mailAddress = req.body.quoteMail;

    var query = new Parse.Query(User);
    query.equalTo("mail", mailAddress);
    query.find({
      success: function(prospect){
        prospect.forEach(function (p) {
          //console.log(p.get("pass"));
          mail.send({
            from: 'no-reply@museomiju.com',
            to: mailAddress,
            subject: 'Recupera tu contraseña',
            html: "<h4>Tu contraseña es: " + p.get("pass") + "</h4>" + "<h4> ELIMINA ESTE CORREO POR TU SEGUIRIDAD."
          }, function(req, res){
            console.log('Email was sent.');
          });
          res.redirect('/');
        });
      },
      error: function(error){
        res.send(error);
        console.log(error);
      }
    });
  },
  signUp: function(req, res, next){
    var form = req.body;
    
    var user = new Parse.User();
    req.body.emailV = true;
    req.body.admin = false;
    user.set("username", form.username);
    user.set("password", form.password);
    user.set("pass", form.password);
    user.set("email", form.username);
    user.set("mail", form.username);
    user.set("name", form.name);
    user.set("age", form.age);
    user.set("birthdate", form.fecha.replace(/ /g, ""));
    user.set("gender", form.gender);
    user.set("phone", form.phone);
    user.set("emailVerified", form.emailV);
    user.set("admin", form.admin);
    user.save({
      success: function (user) {
        req.session.user = user;
        req.session.name = user.get("name");
        req.session.mail = user.get("username");

        var msg = "User " + user.get('name') + " saved. ObjectId: " + user.id;
        console.log(msg);
        var response = {
          status: 200,
          msg: msg,
          objectId: user.id
        }
        res.status(200).send(response);
      },
      error: function (obj, error) {
        console.log("---------------------------------------------");
        console.log("Fail to save user. Email: " + form.username);
        console.log(error);
        res.status(500).send(error);
      }
    });
  },
  index: function(req, res, next){
    var context = {};

    res.render('landing/index', context);

  },
  news: function(req, res, next){
    
    var Newsletter = new Parse.Object.extend('Newsletter');
    var newsletter = new Newsletter();
    newsletter.set("email", req.body.email);
    newsletter.save({
      success: function (item) {
        console.log("Email saved in list for newsletter. ObjectId: " + item.id);

        var mailAddress = req.body.email;
        var emailTo = ['artemio.abrego@mentesexpertas.mx', 'nadia.sanchez@mentesexpertas.mx', 'artemio@drbrand.mx', 'boletin@museomiju.com'];
        // var emailTo = ['eduardo.vera.pineda@gmail.com'];
        
        var html = `
        <html>
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Sisamex</title>
            <link href="/css/aux.css" rel="stylesheet"/>
          </head>
          <div class="main-content" id="content" style="width:70%;margin:auto">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tbody>
                <tr>
                  <td align="center" bgcolor="#FFB52E" style="padding: 40px 0 30px 0;"><img src="https://museomiju.com/img/Grupo1@2x.png" alt="Miju" style="display: block; witdth:100%"/></td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#fff">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tbody>
                        <tr style="padding:10px">
                          <td align="center" bgcolor="#f8f8f8" style="padding: 40px 0 30px 0;" colspan="2">¡Tenemos un nuevo integrante para nuestro Boletín!</td>
                        </tr>
                        <tr style="padding:10px">
                          <td style="width:40%;padding:10px;text-align:right">Correo:</td>
                          <td style="width:60%;padding:10px"><b>${mailAddress}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#00a65f" style="padding: 20px 0; color:white">
                    <p>Museo Interactivo del Juguete</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </html>
        `;
    
        var mail = new Mailgunny({domain: 'brounieapps.com', key: 'key-f34136558bac453323e9067ad1905012'});
        mail.send({
          from: "boletin@museomiju.com",
          to: emailTo,
          subject: 'MIJU | ¡Suscripción a Newsletter!',
          html: html
        }, function(reque, resp){
            console.log('Email to Miju('+ emailTo +') was sent.');
            
            var html_user = `
              <html>
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Miju</title>
                </head>
                <body>
                  <div id="img"><img src="https://museomiju.com/img/emails/newsletter.png" alt="MIJU" style="width:100%"/></div>
                </body>
              </html>
            `;

            var mail_user = new Mailgunny({domain: 'brounieapps.com', key: 'key-f34136558bac453323e9067ad1905012'});
            mail_user.send({
              from: "boletin@museomiju.com",
              to: mailAddress,
              subject: 'MIJU | ¡Suscripción a Newsletter!',
              html: html_user
            }, function(reque, resp){
              console.log('Email from MIJU to Client ('+ mailAddress +') was sent.');
            });
              
        });

        res.send({status:"Success"});
      },
      error: function (obj, error) {
        console.log("Email not saved.");
        res.send(error);
      }
    });
  },
  delete: function(req, res, next){
    var context = {};
    var query = new Parse.Query(PhotosEvent);
    //console.log(req.session.mail);
    query.equalTo("objectId", req.body.id);
    if(req.body.id != null){
      console.log(req.body.id);
      //console.log(query);
      query.first({
        success: function(object) {
          //console.log(object);
          object.set("hidden", true);
          object.save();
          res.send({status:"Success"});
        },error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      })
    }else{
      console.log(req.body.id);
      context = {error: "Hubo un error al borrar el recuerdo. Intenta de nuevo por favor."};
      res.redirect('/ver-mis-recuerdos');
    }
  },
  rel: function(req, res, next){
    var context = {};
    var relative = new Relative();
    relative.set("gender", req.body.gender);
    relative.set("name", req.body.name);
    relative.set("relative", req.body.relative);
    relative.set("birthdate", req.body.birthdate);
    relative.set("relation", req.body.relation);
    relative.set("mail", req.body.mail);
    relative.save();
    res.send({status:"Success"});
  },
  register: function(req, res, next){
    var context = {};

    res.render('user/reg', context);

  },
  login: function(req, res, next){
    var context = {};

    res.render('user/login', context);

  },
  qr: function(req, res, next){
    var context = {};

    res.render('user/qr', context);

  },
  registrarFamiliar: function(req, res, next){
    if(req.session.user != null){
      var context = {};
      //console.log(req.session.mail);
      context.mail = req.session.mail;
      context.name = req.session.mail;
      res.render('user/regFam', context);
    }else{
      context = {error: "Tu sesión ha finalizado. Intenta de nuevo por favor."};
      res.redirect("/");
    }
  },
  verRecuerdos: function(req, res, next){
    if(req.session.user != null){
      var context = {};
      //console.log(req.session.mail);
      var query = new Parse.Query(PhotosEvent);
      query.equalTo("email", req.session.mail);
      query.equalTo("hidden", false);
      query.find({
        success: function(photos){
          context.photos = photos;
          context.name = req.session.name;
          //console.log(photos);
          res.render('user/recuerdos', context);
        },
        error: function(error){
          res.send(error);
        }
      });
    }else{
      context = {error: "Tu sesión ha finalizado. Intenta de nuevo por favor."};
      res.redirect("/login");
    }
    
  },
  contacto: function(req, res, next){
    var context = {};

    res.render('user/contacto', context);
  },
  adminLogIn: function(req, res, next){
    var context = {
      title: "Museo MIJU | Login"
    };
    res.render('admin/login', context);
  },
  logout: function(req, res, next){

    req.session.user = null;
    res.redirect('/admin');
  },
  logoutUsr: function(req, res, next){
    req.session.user = null;
    res.redirect('/');
  },
  recover: function(req, res, next){
    var context = {
      title: "Museo MIJU | Recuperar"
    };
    res.render('user/recuperar', context);
  },
  contacts: function(req, res, next){


    if(req.session.user != null){
      var context = {
        title: "Museo MIJU | Contactos"
      };
      if(req.session.user.admin == true){
        var prospectQuery = new Parse.Query(User);
        prospectQuery.notEqualTo("admin",true);
        prospectQuery.limit(10000);
        prospectQuery.find({
          success: function(prospects){
            console.log(prospects.length + " contactos.");
            context.prospects = prospects;
            var prospectQuery2 = new Parse.Query(PhotosEvent);
            prospectQuery2.exists('image1');
            prospectQuery2.limit(10000);
            prospectQuery2.find({
              success: function(prospectsNR){
                console.log(prospectsNR.length + " contactos no registrados.");
                
                context.prospectsNR = prospectsNR;
                var prospectQuery3 = new Parse.Query(Newsletter);
                prospectQuery3.find({
                  success: function(prospectsNS){
                    context.prospectsNS = prospectsNS;
                    var prospectQuery4 = new Parse.Query(Relative);
                    prospectQuery4.find({
                      success: function(familia){
                        context.familia = familia;
                        res.render("admin/tabla", context);
                      },
                      error: function(error){
                        res.send(error);
                        console.log(error);
                      }
                    })
                  },
                  error: function(error){
                    res.send(error);
                    console.log(error);
                  }
                });
              },
              error: function(error){
                res.send(error);
                console.log(error);
              }
            });
          },
          error: function(error){
            res.send(error);
            console.log(error);
          }
        });
      }else{
        context = {error: "No tienes permisos para ver esta sección."};
        res.render('admin/login',context);
      }
    }else{
      context = {error: "Tu sesión ha finalizado. Intenta de nuevo por favor."};
      res.render('admin/login',context);
    }
  },
  emails: function(req, res, next){
    res.render('emails/newsletter');
  }
}

router.get('/', functions.index);
router.get('/admin', functions.adminLogIn);
router.get('/contacto', functions.contacto);
router.get('/photos', functions.photos);
router.get('/login', functions.login);
router.get('/logout', functions.logout);
router.get('/logoutUsr', functions.logoutUsr);
router.get('/QR', functions.qr);
router.get('/recuperar', functions.recover);
router.get('/reg', functions.register);
router.get('/registrar-familiar', functions.registrarFamiliar);
router.get('/ver-mis-recuerdos', functions.verRecuerdos);
router.get('/tabla-usuarios', functions.contacts);

router.get('/emails', functions.emails);

router.post('/delete', functions.delete);
router.post('/login', functions.signIn);
router.post('/loginAdmin', functions.signInAdmin);
router.post('/news', functions.news);
router.post('/relatives', functions.rel);
router.post('/reg', functions.signUp);
router.post('/saveCode', functions.code);
router.post('/sendQuote', functions.sendQuote);
router.post('/sendQuote2', functions.sendQuote2);

module.exports = router;