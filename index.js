var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
			if (!whatsmylunch(event.sender.id, event.message.text)) {
        sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }
    
    return false;
    
};



// send rich message with kitten
function whatsmylunch(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'whats' && values[1] === 'my' && values[2] === 'lunch?') {
        
            console.log("inside of the function");
            //var imageUrl = "Ingredients : Baked Potato, Onion, Bell Peppers, Oil, Chilly powder, mustard powder, black cumin seed, black mustard seeds, turmeric Directions: 1. Take 2 tb spn of oil in a pan and heat it 2. Add black mustard seeds,black cumin seeds after 2 minutes of heating. 3.Chop all veggies and put in the bowl. 4. let it boil for 5 minutes. Add red chilly powder and mustard powder and spices. " ;
            
            message = {
                "attachment": {
					"text" : "Ingredients : Baked Potato, Onion, Bell Peppers, Oil, Chilly powder, mustard powder, black cumin seed, black mustard seeds, turmeric Directions: 1. Take 2 tb spn of oil in a pan and heat it 2. Add black mustard seeds,black cumin seeds after 2 minutes of heating. 3.Chop all veggies and put in the bowl. 4. let it boil for 5 minutes. Add red chilly powder and mustard powder and spices. "
				

                    
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        
    }
    
    return false;
    
};




