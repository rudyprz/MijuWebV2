var Mailgunny = require('mailgunny');
var moment = require("moment");

Parse.Cloud.afterSave('PhotosEvent', function(request) {
    console.log("AFTER SAVE");
    
    var objectId = request.object.id;
    var userEmail = request.object.get("email");
    var email_send = request.object.get("email_send");
    console.log("----------------------");
    console.log(email_send);
    console.log("----------------------");

    if(email_send == true){
      console.log(true);
      var mail = new Mailgunny({domain:'mg.museomiju.com', key:'b8a554d34cf8a1adb96c21990e714a79-baa55c84-f643f9f8'});
  
      var html = `
      <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Miju</title>
        <style>
    html {
      line-height: 1.15;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    body {
      margin: 0;
    }
    h1 {
      font-size: 2em;
      margin: 0.67em 0;
    }
    a {
      background-color: transparent;
      -webkit-text-decoration-skip: objects;
    }
    html {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
    }
    .row {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
    }
    .row:after {
      content: "";
      display: table;
      clear: both;
    }
    .row .col {
      float: left;
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      padding: 0 0.75rem;
      min-height: 1px;
    }
    
    .row .col.s12 {
      width: 100%;
      margin-left: auto;
      left: auto;
      right: auto;
    }
    
    @media only screen and (min-width: 601px) {
      
      .row .col.m2 {
        width: 16.6666666667%;
        margin-left: auto;
        left: auto;
        right: auto;
      }
      .row .col.m3 {
        width: 25%;
        margin-left: auto;
        left: auto;
        right: auto;
      }
      .row .col.m4 {
        width: 33.3333333333%;
        margin-left: auto;
        left: auto;
        right: auto;
      }
      .row .col.m6 {
        width: 50%;
        margin-left: auto;
        left: auto;
        right: auto;
      }
      .row .col.m8 {
        width: 66.6666666667%;
        margin-left: auto;
        left: auto;
        right: auto;
      }
      .row .col.offset-m3 {
        margin-left: 25%;
      }
      .row .col.offset-m4 {
        margin-left: 33.3333333333%;
      }
    }
    
    
    a {
      text-decoration: none;
    }
    
    html {
      line-height: 1.5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      font-weight: normal;
      color: rgba(0, 0, 0, 0.87);
    }
    
    @media only screen and (min-width: 0) {
      html {
        font-size: 14px;
      }
    }
    
    @media only screen and (min-width: 992px) {
      html {
        font-size: 14.5px;
      }
    }
    
    @media only screen and (min-width: 1200px) {
      html {
        font-size: 15px;
      }
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: 400;
      line-height: 1.3;
    }
    
    h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {
      font-weight: inherit;
    }
    
    
    h2 {
      font-size: 3.56rem;
      line-height: 110%;
      margin: 2.3733333333rem 0 1.424rem 0;
    }
    
    h3 {
      font-size: 2.92rem;
      line-height: 110%;
      margin: 1.9466666667rem 0 1.168rem 0;
    }
    
    h4 {
      font-size: 2.28rem;
      line-height: 110%;
      margin: 1.52rem 0 0.912rem 0;
    }
    
    h5 {
      font-size: 1.64rem;
      line-height: 110%;
      margin: 1.0933333333rem 0 0.656rem 0;
    }
    
    h6 {
      font-size: 1.15rem;
      line-height: 110%;
      margin: 0.7666666667rem 0 0.46rem 0;
    }
        </style>
        <style>
    .no-margin {
      margin: 0; }
    
    .no-padding {
      padding: 0; }
    
    .padding-top-20 {
      padding-top: 20px !important; }
    
    .padding-left-20 {
      padding-left: 20px !important; }
    
    .padding-right-20 {
      padding-right: 20px !important; }
    
    .margin-top-50 {
      margin-top: 50px !important; }
    
    h5, p {
      color: #555; }
    
    p.italic-font {
      font-style: italic; }
    
    #thanks h5 {
      font-weight: 400; }
    
    .whiteSquare {
      background-color: white;
      border: 2px solid #e3e3e3; }
    
    .greySquare {
      background-color: #f0f1f1;
      padding: 15px;
      border-radius: 13px;
      border: 2px solid #e3e3e3; }
    
    .greenNumber {
      color: white;
      background-color: #01a660;
      max-width: 40px;
      height: 40px;
      border-radius: 50%;
      line-height: 40px; }
    
    .info {
      line-height: 40px; }
    
          @media only screen and (max-width: 600px) {
            #thanks h2 {
              font-size: 1em; 
            } 
          }
    
        </style>
        <style>
          .center{
            text-align:center
          }
          
        </style>
      </head>
      <body>
        <div style="width: 80%; margin:auto">
          <div class="row margin-top-50">
            <div class="col s12 m2"><img src="https://museomiju.com/img/emails/logo.png" alt="MIJU" style="width:100%"/></div>
          </div>
          <div class="row" id="thanks">
            <div class="col s12 m6 offset-m3 center">
              <h5>¡Gracias por tomarte la foto en nuestra exhibición de Transformers!</h5>
              <h6>Para tener acceso a la foto, entra a www.museomiju.com/reg</h6>
            </div>
          </div>
          <div class="greySquare padding-20">
            <div class="container">
              <div class="row">
                <div class="col s12 no-padding">
                  <h5 class="center info no-margin">Una vez que accedas te pediremos que te registres como sobrino el Club del Tío Temo</h5>
                </div>
              </div>
              <div class="row">
                <div class="col s12 no-padding">
                  <ol> 
                    <li>Ingresa los datos que te solicitamos</li>
                    <li>Entras a ver tu foto o todas las fotos que tomaste danto tu mismo correo electrónico.</li>
                    <li>Y listo ya puedes bajarlas, compartirlas en tus redes sociales, con familiares y amigos. </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div class="row"> 
            <div class="col s12 center">
              <h5>¿Porqué es importante inscribirte en el Club del tío Temo?</h5>
              <p>Entérate de los avances de la construcción del Museo MIJU</p>
              <p>Participa en los concursos para ganar cosas interesantes </p>
              <p>Recibe descuentos en las entradas (Próximamente)</p>
              <p>Previo a la apertura del museo tendrás privilegios exclusivos para "sobrinos" del Tío Temo</p>
              <p>Dinos que más te gustaría recibir de este club en contacto@museomiju.com</p>
              <p>¡Haremos de casa visita una experiencia única!</p>
            </div>
          </div>
          <div id="img"><img src="https://museomiju.com/img/emails/welcome.png" alt="MIJU" style="width:100%"/></div>
        </div>
      </body>
    </html>
      `;
                  
      console.log("Sending email to user: " + userEmail);
  
      mail.send({
          from: "clubdeltiotemo@museomiju.com",
          to: userEmail,
          subject: 'Museo MIJU | ¡Regístrate o inicia sesión al club del tío temo para ver tu foto!',
          html: html
      }, function(req1, res1){
          console.log('Welcome email from Miju to ' + userEmail + ' sent.');
      });
    }
    else{
      console.log("email_send: false.");
    }
});
