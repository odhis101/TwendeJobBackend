import twilio from 'twilio';
const accountSid = 'AC8c9b65406300a5fb2456e225ed765b11';
const authToken = '396516a55b393caab2bd3f0827ac1998';
const client = twilio(accountSid, authToken);

client.messages.create({
    to: '+254703757369',
    from: '+15076154216',
    body: 'Hello from Twilio!'
  })
  .then(message => console.log(`SMS message sent: ${message.sid}`))
  .catch(error => console.log(`Error sending SMS message: ${error}`));