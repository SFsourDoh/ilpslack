/*jslint node: true */
/*jslint es5: true */
'use strict';

var WalletClient = require('five-bells-wallet-client');
var express = require('express');
var myParser = require('body-parser');
var app = express();

function sendIlp(text) {
  var inputs = text.split(' ');
  console.log(inputs);
  const sender = new WalletClient({
    address: 'slackbrett@red.ilpdemo.org',
    password: 'spanner21'
  })

  sender.on('connect', () => {
    console.log('Sender connected')
  })

  sender.send({
    destination: inputs[1],
    destinationAmount: inputs[0],
    message: inputs[2],
    onQuote: (payment) => {
      console.log('Received a quote; this will cost us: ' + payment.sourceAmount)
    }
  }).then((payment) => {
    console.log('Sent payment:', payment)
    console.log('')
    return payment;
  }).catch((err) => {
    console.error(err.stack)
  })
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.use(myParser.urlencoded({extended : true}));
app.post('/', function (req, res, next) {
  console.log('POST /');
  console.log(req.body.text);
  sendIlp(req.body.text);
  res.send(req.body.text  + ' sent');
  res.end();
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

