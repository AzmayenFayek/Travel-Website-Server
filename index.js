const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb2uj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function run() {
    try {
        await client.connect();
        console.log("database connected");
    }
    finally {

    }
}

run().catch(console.dir);


const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Helo World!')
});
client.connect((err) => {
    const EventsCollection = client.db("random-Events").collection("Events");

    // add Events
    app.post("/addEvents", async (req, res) => {
        const result = await EventsCollection.insertOne(req.body);
        res.send(result.insertedId);
    });

    // get all events

    app.get("/allEvents", async (req, res) => {
        const result = await EventsCollection.find({}).toArray();
        res.send(result);
    });

    app.get("/events/:id", async (req, res) => {
        const id = (req.params.id);
        const query = { _id: ObjectId(id) };
        const details = await EventsCollection.findOne(query);
        res.json(details);
    })

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})