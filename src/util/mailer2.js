require("dotenv").config();
var nodemailer = require('nodemailer');
const { displayDate } = require(".");
const logger = require("./log");

const ticketTemplate = (data = {}) => {
     return `
     <!DOCTYPE html>
<html lang="en">

<head>
     <meta charset="UTF-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>${ data?.event?.title } : Thank you for coming</title>
     <link rel="icon" type="image/x-icon" href="https://isce.app/assets/images/favicon-light.ico"></link>
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet">

     <style>
          * {
               font-family: 'Poppins', sans-serif;
               margin: 0;
               padding: 0;
               box-sizing: border-box;
          }

          a {
               text-decoration: none;
          }

          body,
          section {
               width: 100%;
               position: relative;
          }

          section {
               padding-top: 50px;
          }

          .container {
               max-width: 600px;
               margin: auto;
               text-align: start;
               padding-left: 10px;
               padding-right: 10px;
          }

          .nav {
               background-color: black;
               width: 100%;
          }

          footer {
               background-color: whitesmoke;
               width: 100%;
          }

          td {
               font-size: small;
          }

          th {
               text-align: left;
               font-size: small;
          }

          .ticket {
               box-shadow: 0px 0px 4px 5px rgba(0, 0, 0, 0.4);
               border-radius: 10px;
               max-width: 400px;
               margin: 0 auto;
          }
     </style>
</head>

<body>
     <div>
          <div class="nav" style="background-color: black; width: 100%;">
               <div class="container" style="text-align: center; padding-top: 10px; padding-bottom: 10px;">
                    <a href="${ encodeURI('https://isce.app') }">
                         <img src="${ encodeURI('https://isce.app/static/media/logofull-dark.799050dcfe6253adf98e.webp') }" alt="ISCE"
                              height="20px">
                    </a>
               </div>
          </div>
          <section class="container">
               <div class="ticket">
                    <div class="content" style="margin-bottom: 50px;">
                         <div
                              style="overflow: hidden; height: 150px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                              <img src="${ encodeURI(data?.event?.image) }"
                                   alt="Event" height="150px" width="100%"
                                   style="object-fit: cover; object-position: top;">
                         </div>
                         <div class="details" style="width: 100%; padding: 20px;">
                              <div class="event_name" style="font-weight: 700; font-size: 18px;">Hello ${ data?.attendee?.name },</div>

                              <div class="" style="font-weight: 300; font-size: 10; margin-bottom: 20px;">
                                   <span class="event_date">Thank you so much for taking out the time to be with us yesterday. We had the first of many milestones, and we trust you enjoyed the evening as much as we did.</span>
                              </div>

                              <div class="" style="font-weight: 300; font-size: 10; margin-bottom: 20px;">
                                   <span class="event_date">We are here to answer any more questions you might have on the endless possibilities of the ISCE cards.</span>
                              </div>

                              <div class="" style="font-weight: 300; font-size: 10; margin-bottom: 20px;">
                                   <span class="event_date">If you haven't purchased the cards yet, kindly go to <a href="https://isce.app/get-started">isce.app/get-started</a> to jump on this.</span>
                              </div>

                              <div class="" style="font-weight: 300; font-size: 10; margin-bottom: 20px;">
                                   <span class="event_date">Thanks once again. Have a N-ISCE week ahead.</span>
                              </div>

                              <div>
                                   <div class="token_barcode">
                                        <table width="100%" style="margin-bottom: 20px;">
                                             <tr>
                                                  <td>
                                                  King Regards, <br />
                                                  The ISCE Team 
                                                  </td>
                                             </tr>
                                        </table>

                                   </div>
                              </div>

                         </div>
                    </div>
               </div>
          </section>
          <footer>
               <div class="container" style="padding-top: 20px; padding-bottom: 20px;">
                    <table style="width: 100%;">
                         <tr>
                              <td style="text-align: start;">
                                   Create your digital culture.
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

</html>
     `;
}

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASS
    }
});

const sendThankyouMail = async (data = {}) => {
    const d_data = data?.data;
    const mailOptions = {
        from: data?.from || ('<event@isce.app>'),
        to: data?.to,
        subject: data?.subject,
        html: ticketTemplate(d_data)
    };
  
    try {
        const info = await transport.sendMail(mailOptions);
        return info;
    } catch (error) {
        logger(error);
        return null;
    }
}

module.exports = { ticketTemplate, nodemailer, sendThankyouMail }