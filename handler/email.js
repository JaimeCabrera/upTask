const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");

console.log("enviando correo");
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailConfig.user, // generated ethereal user
    pass: emailConfig.pass, // generated ethereal password
  },
});
// generar html
const generarHmtl = (archivo, opciones = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${archivo}.pug`,
    opciones
  );
  return juice(html);
};

exports.enviar = async (opciones) => {
  const html = generarHmtl(opciones.archivo, opciones);
  const text = htmlToText.fromString(html);
  let info = await transporter.sendMail({
    from: '"UpTask " <no-reply@uptask.com>', // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subject, // Subject line
    text, // plain text body
    html, // html body
  });
  // send mail with defined transport object
  // util si algo no sopoprta async await
  const enviarEmail = util.promisify(transporter.sendMail, transporter);
  return enviarEmail.call(transporter, info);
};
