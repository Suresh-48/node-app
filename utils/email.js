import sgMail from "@sendgrid/mail";
sgMail.setApiKey("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");

export function sendMail(msg) {
  sgMail.send(msg).then((res) => {});
}
