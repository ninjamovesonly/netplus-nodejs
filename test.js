const nodemailer = require("nodemailer")
const {MailSlurp, CreateInboxDtoInboxTypeEnum} = require('mailslurp-client');
const log = require('debug')('ms:smtp')

describe('node mailer smtp usage', () => {
let config;

    beforeAll(() => {
        // provide a mailslurp API KEY
        const apiKey = process.env.API_KEY;
        expect(apiKey).toBeTruthy();
        // create config for clients and main class
        config = {apiKey};
    });

    it('can create smtp inbox then send email to it with nodemailer', async () => {
        log("Create inbox")
        const mailslurp = new MailSlurp(config);
        const inbox = await mailslurp.createInbox();
        expect(inbox.id).toBeTruthy();
        expect(inbox.emailAddress).toContain('@mailslurp.com');

        log("Start transport")
        const transport = nodemailer.createTransport({
            host: "mx.mailslurp.com",
            port: 2525,
            secure: false
        })

        const sent = await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: inbox.emailAddress,
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });
        log("Email sent")
        expect(sent.messageId).toBeTruthy()

        log("Wait for latest")
        const email = await mailslurp.waitForLatestEmail(inbox.id, 30000, true)
        expect(email.subject).toContain("Hello")
        expect(email.isHTML).toBeTruthy()
    });


    it('can create smtp inbox then send email from a mailslurp address', async () => {
        log("Try plain auth")
        const mailslurp = new MailSlurp(config);
        const inbox = await mailslurp.createInboxWithOptions({inboxType:CreateInboxDtoInboxTypeEnum.SMTP_INBOX});
        const server = await mailslurp.getImapSmtpAccessDetails()

        log("Fetched imap smtp access")
        expect(inbox.id).toBeTruthy();
        expect(inbox.emailAddress).toContain('@mailslurp.mx');

        const opts = {
            host: server.smtpServerHost,
            port: server.smtpServerPort,
            secure: false,
            auth: {
                user: server.smtpUsername,
                pass: server.smtpPassword,
                type: "PLAIN"
            },
        }
        log("Create auth plain transport")
        const transport = nodemailer.createTransport(opts)

        log("Send email")
        const sent = await transport.sendMail({
            from: inbox.emailAddress,
            to: inbox.emailAddress,
            subject: "Test outbound email",
            text: "Can I send on behalf?",
            html: "<b>Hello world</b>",
        });
        expect(sent.messageId).toBeTruthy()

        log("Wait for email to arrive")
        const email = await mailslurp.waitForLatestEmail(inbox.id, 30000, true)
        expect(email.subject).toContain("Test outbound")
        expect(email.isHTML).toBeTruthy()
    });
});