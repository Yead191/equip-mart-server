const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors())


app.get('/', (req, res)=>{
    res.send('equi server on')
})
app.listen(port, ()=>{
    console.log('server running on ', port);
})