require("dotenv").config();
var nodemailer = require('nodemailer');
const logger = require("./log");

const ticketTemplate = (data = {}) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
         <meta charset="UTF-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>ISCE - Your Ticket</title>
         <link rel="preconnect" href="https://fonts.googleapis.com">
         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
         <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
              rel="stylesheet">
         <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,700;1,900&display=swap"
              rel="stylesheet">
    
    
         <style>
              * {
                   font-family: 'Lato', sans-serif;
                   margin: 0;
                   padding: 0;
                   box-sizing: border-box;
              }
    
              a {
                   text-decoration: none;
              }
    
              body,
              section {
                   /* min-height: 100vh; */
                   width: 100%;
                   position: relative;
              }
    
              section {
                   padding-top: 50px;
              }
    
              .container {
                   max-width: 600px;
                   margin: 0 auto;
                   text-align: center;
                   padding-left: 10px;
                   padding-right: 10px;
              }
    
              .nav {
                   background-color: black;
                   width: 100%;
              }
    
              .ticket {
                   position: relative;
                   border-radius: 10px;
                   margin: 10px auto 30px auto;
                   max-width: 300px;
                   display: flex;
                   background: white;
                   background-color: #100C08;
                   background-position: center;
                   object-fit: cover;
                   overflow: hidden;
                   box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
                   -webkit-box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
                   -moz-box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
              }
    
              .overlay {
                   position: absolute;
                   background-color: #000000;
                   height: 100%;
                   width: 100%;
                   opacity: .4;
              }
    
              .content {
                   z-index: 1;
                   opacity: 1;
                   color: #ffffff;
                   text-align: center;
                   width: 100%;
                   padding: 20px 20px;
              }
    
              footer {
                   background-color: whitesmoke;
                   width: 100%;
              }
    
              td {
                   font-size: small;
              }
    
              .event_name {
                   font-size: x-large;
                   text-align: start;
                   font-weight: bold;
              }
    
              .attendee_image {
                   height: 100px;
                   width: 100px;
                   overflow: hidden;
                   border-radius: 50%;
              }
    
              .event_date {
                   text-align: start;
                   margin-top: 20px;
              }
    
              .attendee {
                   margin-top: 20px;
                   font-size: x-large;
                   font-weight: bold;
                   text-align: start;
              }
    
              .ticket_type {
                   margin-top: 20px;
                   font-weight: 900;
                   font-size: 45px;
                   text-align: start;
                   background-image: linear-gradient(black, #6B6D76);
                   -webkit-text-fill-color: transparent;
                   -moz-text-fill-color: transparent;
                   background-clip: text;
                   -webkit-background-clip: text;
                   -moz-background-clip: text;
              }
    
              .token_barcode {
                   margin-top: 20px;
              }
    
              .token_button {
                   background-color: #5AFF7F;
                   color: #373737;
                   letter-spacing: 6px;
                   margin-top: 10px;
                   width: 100%;
                   padding: 7px 0;
                   border-radius: 15px;
                   box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
                   -webkit-box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
                   -moz-box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
              }

              .token_link {
                background-color: #FFFFFF;
                color: #373737;
                letter-spacing: 6px;
                margin-top: 10px;
                width: 100%;
                padding: 7px 0;
                border-radius: 15px;
                box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
                -webkit-box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
                -moz-box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.75);
           }

           .d-none {
               display: none;
           }
    
              .extra_information {
                   width: 250px;
                   margin: 10px auto 50px auto;
                   font-size: smaller;
              }
         </style>
    </head>
    
    <body>
         <div>
              <div class="nav">
                   <div class="container" style="text-align: center; padding-top: 10px; padding-bottom: 10px;">
                        <a href="https://isce.app">
                             <img src="https://isce.app/static/media/logofull-dark.799050dcfe6253adf98e.webp" alt="ISCE"
                                  height="20px">
                        </a>
                   </div>
    
              </div>
              <section class="container">
                   <h4>Registration Successful!!!</h4>
                   <div class="ticket">
                        <div class="overlay"></div>
                        <div class="content">
                             <b>Token Generated</b>
                             <table style="width: 100%; margin-top: 20px;">
                                  <tr>
                                       <td>
                                            <div class="event_name">
                                                 ${data?.title}
                                            </div>
                                       </td>
                                       <td>
                                            <div class="attendee_image">
                                                 <img src="${data?.image}"
                                                      alt="Attendee's Name" height="100px" width="100px">
                                            </div>
                                       </td>
                                  </tr>
                             </table>
    
                             <div class="event_date">
                                  ${data?.event_date}
                             </div>
                             <div class="attendee">
                                  ${ data?.name }
                             </div>
                             <div class="ticket_type">
                                  ${data?.pass_type}
                             </div>
                             <div class="token_barcode">
                                  <img src="${data?.qrcode}" alt="" height="50px">
                             </div>
                             <div class=${ data?.token ? 'token' : 'd-none'}>
                                  <div class="token_button">${data?.token ? data?.token : '' }</div>
                             </div>
                             <div class="token">
                             <a class="token_link" href="${ data?.arena }">Visit Event Arena</a>
                             </div>
                        </div>
                   </div>
                   <!-- <div class="extra_information">
                        Some extra information should be provided here for users to know what is next
                   </div> -->
              </section>
              <footer>
                   <div class="container" style="padding-top: 20px; padding-bottom: 20px;">
                        <table style="width: 100%;">
                             <tr>
                                  <td style="text-align: start;">
                                       Get a smoother way to network with just one tap.
                                  </td>
                                  <td style="text-align: end;">
                                       event@isce.app<br>
                                       +234-812-433-9827<br>
                                  </td>
                             </tr>
                        </table>
                   </div>
              </footer>
         </div>
    </body>
    
    </html>`;
}

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASS
    }
});

const sendMail = async (data = {}) => {
    var mailOptions = {
        from: data?.from || '"ISCE Support" <event@isce.app>',
        to: data?.to,
        subject: data?.subject,
        html: ticketTemplate(data?.data)
    };
  
    try {
        const info = await transport.sendMail(mailOptions);
        return info;
    } catch (error) {
        logger(error);
        return null;
    }
}

module.exports = { ticketTemplate, nodemailer, sendMail }