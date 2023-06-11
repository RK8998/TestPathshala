const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {mongoUrl} = require('./keys')
const routes = require('./routes/routes')

const app = express()
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json())
app.use(routes)


// MongoDB Connection Code....
mongoose.connect(mongoUrl,{
    useNewUrlParser:true
}).then(()=>{
    console.log('Database Connected')
}).catch((err)=>{
    console.log("Connection Error : "+err);
    process.exit();
})


app.get('/',(req,res)=>{
    res.status(200).send('welcome to TP node server..')
})

const hostname = "192.168.0.6";
// const hostname = "10.0.2.2";
const port = "3001"
app.listen(port,hostname,()=>{
    console.log(`Test Pathshala Server running on 3001`);
})