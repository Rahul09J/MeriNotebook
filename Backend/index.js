const connectToMongo = require('./db');
const express = require('express');
const app = express();
connectToMongo();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("huu ");
})

// Available Routes

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

const port = 2003;
app.listen(port,()=>{
    console.log("Listinig to Project");
})