const express = require('express');
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: 'wCHbmAs/+7kSVx3tVh1+NcT5aqegMV7EVCem/2PH/rBu2l6UxLXK9iUNzKJqPc8aFbQPBdgDkPTZtrqexuVYO1ouKX9IBePRuCXzvM6sV8K86Nrk4R8MbArzhfCzU4OZYpnAnorwUzEdhUr/lUP/BAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '812b205d3fb5daa7cd058272c5231f92'
};

const client = new line.Client(config);

const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyBo-hlgaIW6qJbLXG5lEUgOy46dDKhyOzY",
    authDomain: "lineoa-21c10.firebaseapp.com",
    projectId: "lineoa-21c10",
    storageBucket: "lineoa-21c10.appspot.com",
    messagingSenderId: "77822548043",
    appId: "1:77822548043:web:1acf8db54ce563a0fe15ce",
    measurementId: "G-4HVZXJW984"
} 
const admin = firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

const app = express();
const port = 3000

app.post('/webhook', line.middleware(config), (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    //console.log(event);
    //console.log(event.message);
    //console.log(event.message.text);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}

// Respond with Hello World! on the homepage:
app.get('/', function (req, res) {
    res.send('Hello World!')
})
app.post('/', function (req, res) {
    res.send('Got a POST request')
})
// Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
// Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})
app.get('/test-firebase', async function (req, res) {
    let data = {
        name: 'Tokyo',
        country: 'Japan'
    }
    const result = await db.collection('cities').add(data);
    console.log('Added document with ID: ', result.id);
    res.send('Test firebase successfully, check your firestore for a new record !!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    // SAVE TO FIREBASE
    let chat = await db.collection('chats').add(event);
    console.log('Added document with ID: ', chat.id);
    
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}

