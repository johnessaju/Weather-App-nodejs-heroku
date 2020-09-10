//dotenv is installed for configureing key
//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
//The process.env global variable is injected by the Node at runtime for your application to use and it represents the state of the system environment your application is in when it starts. 
require('dotenv').config(); // updates key variable in this case weather_key set in .env file

// by default heroku starts with npm start so update package.json to
/*"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  */
 // gitignore file is used to tell github to avoid the file which are to be uploaded to github
const key= process.env.weather_key;  // loaded from .env file
const express = require('express');
const app = express();
const bodyparser = require('body-parser');//In order to get access to the post data we have to use body-parser . Basically what the body-parser is which allows express to read the body and then parse that into a Json object that we can understand.
const axios= require('axios');
const path= require('path');

var port= process.env.PORT || 3000; // process.env.PORT is the port given by heroku

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,'public'))); // path.join is used to join paths to root directory, not necessary here but its gud practise

app.listen(port,console.log('server started')); 

app.get('/',(req,res)=>{ // for all get request
    res.sendFile(path.join(__dirname,'public/index.html'));
});

app.post('/data',(req,res)=>{ // for post requests
    console.log(req.body.place);
    var url= `http://api.openweathermap.org/data/2.5/weather?q=${req.body.place}&appid=${key}`;
    
   
    axios({ // because fetch is not much supported in nodejs ,perform same as fetch
        url: url,
        responseType: 'json'
      }).then(data => {console.log(data.data);
    res.json(data.data)}).catch(err=>{ // if place typed is not available so it returns error
      
      console.log(err.response.data);
      res.status(404).send(err.response.data); // sends resonse with status and error data
     
    });

});

