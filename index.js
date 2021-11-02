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

    // const allEvents = [{ "_id": "617e894c02417da9942ba4c1", "title": "Safari Park", "date": "2021-10-06", "image": "https://i.imgur.com/kKagdmJ.jpg", "price": "900", "time": "2 Days Tour", "description": "Don't Miss Out, Reserve Today and Pay Up to 1 Days Before Your Activity. Quick & Easy Purchase with Flexibility to Cancel up to 24 Hours Before the Tours Starts." }, { "_id": "617e8bbb2457dca90905ffd2", "title": "Finland", "date": "2021-11-06", "image": "https://preview.colorlib.com/theme/tralive/assets/img/gallery/xservices1.jpg.pagespeed.ic.Aq-IpiEePi.webp", "price": "1120", "time": "5 Days Tour" }, { "_id": "617ea0b4f17fea2a8a6804bf", "title": "Mega Turkey", "date": "2021-11-06", "image": "https://preview.colorlib.com/theme/tralive/assets/img/gallery/xservices2.jpg.pagespeed.ic.T_OY2-P6jf.webp", "price": "1100", "time": "7 Days Tour", "description": "Airport transfers, staying good hotels, return flight tickets, day tours included. 7 Days Turkey Tour from Istanbul by flight. This tour is our most popular tour." }, { "_id": "617f32a13577c49275d36ca6", "title": "Mega Turkey", "date": "2021-11-06", "image": "https://i.imgur.com/tdO9gpE.jpg", "time": "5 Days Tour", "description": "Don't Miss Out, Reserve Today and Pay Up to 4 Days Before Your Activity. Quick & Easy Purchase with Flexibility to Cancel up to 24 Hours Before the Tours Starts.", "price": "1100" }, { "_id": "617f32bc3577c49275d36ca7", "title": "Sydney", "date": "2021-11-12", "image": "https://preview.colorlib.com/theme/tralive/assets/img/gallery/xservices2.jpg.pagespeed.ic.T_OY2-P6jf.webp", "price": "1111", "time": "3 days", "description": "Don't Miss Out, Reserve Today and Pay Up to 3 Days Before Your Activity. Quick & Easy Purchase with Flexibility to Cancel up to 24 Hours Before the Tours Starts." }, { "_id": "617f93f8efa31c8b59cc94dc", "title": "Mega Turkey", "date": "2021-11-06", "image": "https://preview.colorlib.com/theme/tralive/assets/img/gallery/xservices1.jpg.pagespeed.ic.Aq-IpiEePi.webp", "price": "1100", "time": "7 Days Tour", "description": "Airport transfers, staying good hotels, return flight tickets, day tours included. 7 Days Turkey Tour from Istanbul by flight. This tour is our most popular tour." }]

    app.get("/allEvents/:id", (req, res) => {
        // res.send(allEvents[req.params.id]);

        const id = (req.params.id);
        const query = { _id: ObjectId(id) };
        const details = await EventsCollection.findOne(query);
        res.json(details);
    })

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})