const express = require('express');
const transporter = require('../Utils/email');
const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body.mail;

  const mail = {
    from: data.name,
    to: process.env.EMAIL,
    subject: 'New Email from user',
    text: `${data.name} <${data.email}> \n${data.message}`,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error sending message' });
    } else {
      res.status(200).json({ message: 'Email send successfully' });
    }
  });
});

module.exports = router;
