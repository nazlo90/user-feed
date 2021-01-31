const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const cors = require('cors');
const connectionString = 'mongodb+srv://admin:admin@cluster0.c0ams.mongodb.net/user-feed-posts?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('user-feed')
    const quotesCollection = db.collection('posts')

    // ========================
    // Middlewares
    // ========================
    app.use(bodyParser.json())
    app.use(cors())

    // ========================
    // Routes
    // ========================
    app.get('/get-posts', (req, res) => {
      db.collection('posts').find().toArray()
        .then(quotes => {
          res.json(quotes);
        })
        .catch(error => console.error(error))
    })


    app.post('/add-post', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/get-posts')
        })
        .catch(error => console.error(error))
    })

    app.post('/remove-post', (req, res) => {
      quotesCollection.deleteOne(req.body)
        .then(result => {
          res.end(
            db.collection('posts').find().toArray()
              .then(quotes => {
                res.json(quotes);
              })
              .catch(error => console.error(error))
          );
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
