require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wudpw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Send a ping to confirm a successful connection


        const equipmentCollection = client.db("equipments").collection("equipment")


        app.post('/equipments', async (req, res) => {
            const data = req.body
            const result = await equipmentCollection.insertOne(data)
            res.send(data)
        })

        app.get('/equipments', async (req, res) => {
            const result = await equipmentCollection.find().toArray()
            res.send(result)
        })
        app.get('/equipments/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await equipmentCollection.findOne(filter)
            res.send(result)
        })

        app.get("/user", async (req, res) => {
            const email = req.query.email;
            const filter = { email };

            const result = await equipmentCollection.find(filter).toArray();
            res.send(result);

        });
        app.delete('/equipments/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await equipmentCollection.deleteOne(filter)
            res.send(result)

        })
        app.put('/equipments/:id', async (req, res) => {
            const updatedProduct = req.body
            const product = {
                $set: {
                    name: updatedProduct.name,
                    photo: updatedProduct.photo,
                    category: updatedProduct.category,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    customization: updatedProduct.customization,
                    processingTime: updatedProduct.processingTime,
                    stockStatus: updatedProduct.stockStatus,
                    
                }
            }
            const id = req.params.id 
            const filter= {_id: new ObjectId(id)}
            const options = { upsert: true }
            const result = await equipmentCollection.updateOne(filter, product, options)
            res.send(result) 
        })






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('equi server on')
})
app.listen(port, () => {
    console.log('server running on ', port);
})