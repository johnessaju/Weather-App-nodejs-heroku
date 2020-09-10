var information; // temporarly hold data for each place request so onclick works
// !! tried using adddeventlistener but when clicked multiple times a new event is emmited each time
// so  it causes problem to solve that i used {once:true} option in addeventlistener but caused the event only once
// which resulted in not changeing the temperature back again because event only fired once

const outputplace = document.querySelector(".output-place");// for displaying error!! place not found

  const place=document.querySelector(".place"); //input field
const temperaturesection=document.querySelector(".temperature-section");
const weatherdescription=document.querySelector(".weather-description");
const feelslike=document.querySelector(".feels-like");
const humidity=document.querySelector(".humidity");
const formplace = document.querySelector(".formplace");
const card = document.querySelector(".card");
const imagesrc= document.querySelector("img");
const carddisplay= document.querySelector(".card-display");
const errormessage= document.querySelector(".error-message");
const errormessagecontainer= document.querySelector(".error-message-container");
const cityname = document.querySelector(".city-name");

// this portion is for updateing data in dom
const carddataimage = document.getElementById("card-data-image");
const temperaturedatasection = document.getElementById("temperature-data-section");
const temperaturedatasymbol = document.getElementsByClassName("temperature-symbol"); // return a array of elements so use element[0],element[1]
const weatherdatadescription = document.getElementById("weather-data-description");
const updata = document.getElementById("temperature-up-data-section");
const downdata = document.getElementById("temperature-down-data-section");
const weatherdataimage =document.getElementById("weather-data-image");
const datafeellike = document.querySelector("[Data-feels-like]"); //data attributes can be used for selecting elements
const datahumidity =document.querySelector("[Data-humidity]");
/////// event listener to submit entered text
formplace.addEventListener('submit',e => { //e is the event of form
  e.preventDefault(); // prevents the form values getting reset which is a default behaviour of forms so we use preventdefault to avoid default function
  if(place.value.length!=0)// to avoid seach empty string
  test();
});


//// event listener for changing place option as typing
place.addEventListener("input", function(){ // when passing parameters in fuction use a  "anonymous function" that calls the specified function with the parameters refer w3 website

outputplace.style.display="block";
errormessagecontainer.style.display="none";
carddisplay.style.display="none"; 

placesloader(place.value);

});


///////// function test() is  used to fetch weather data from nodejs server

function test(){   // used to fetch weather data from nodejs server
     outputplace.innerHTML="";
     outputplace.style.display="none";
     fetch('/data',{   // fetch returns a promise 
     method: 'POST',
     headers: {
       'Content-type': 'application/json', // content of request send
       'Accept': 'application/json' // content of response
     },
     body: JSON.stringify({
       place:place.value
 })}).then(res=>res.json()) // then is used to handle th response
 .then(data=>{ // then is used again to handle response from res.json() 
   if(data.cod==200){// is the status of response if it is 200 ok or error is displayed
   if(data.weather[0].icon.includes('d')) // shanges image of card based on response
   carddataimage.src='img/day.jpg';
   else
   carddataimage.src='img/night.jpg';
   
   cityname.innerHTML=data.name;
   information=data;
   temperaturedatasection.innerHTML= Math.round(data.main.temp-273.15);
   temperaturedatasymbol[0].innerHTML="C"; // innerhtml actually changes the inner elements within the selected element
   temperaturedatasymbol[1].innerHTML="C";
   temperaturedatasymbol[2].innerHTML="C";
   temperaturedatasymbol[3].innerHTML="C";
  
   weatherdatadescription.innerHTML=data.weather[0].description;
   updata.innerHTML=Math.round(data.main.temp_min-273.15);
   downdata.innerHTML=Math.round(data.main.temp_max-273.15);
   weatherdataimage.src=`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; //inside tiks we can write html tags eg: <h1>hello</<h1>
   datafeellike.innerHTML=Math.round(data.main.feels_like-273.15);
   datahumidity.innerHTML=data.main.humidity;

   errormessagecontainer.style.display="none";
   carddisplay.style.display="block"; //sets style display to block from none
  formplace.reset();
  }
else{
errormessage.innerHTML=data.message;
errormessagecontainer.style.display="flex";
carddisplay.style.display="none"; //sets style display to none 
formplace.reset();
}

}); 
   }


   // function temperaturechanger(data) to change temperature from celcius to farenhiet

   function temperaturechanger(){
   
    if(temperaturedatasymbol[0].innerHTML=="F"){
    //Every HTML element is an element node
    // The text inside HTML elements are text nodes
     temperaturedatasymbol[0].firstChild.nodeValue='C'; // to change inner value without replacing any element
     temperaturedatasymbol[1].firstChild.nodeValue='C'; // temperaturedatasymbol[n] because it returns an array of elemensts with same class name
     temperaturedatasymbol[2].firstChild.nodeValue='C';
     temperaturedatasymbol[3].firstChild.nodeValue='C';
     temperaturedatasection.firstChild.nodeValue= Math.round(information.main.temp-273.15);
     updata.firstChild.nodeValue=Math.round(information.main.temp_min-273.15);
  downdata.firstChild.nodeValue=Math.round(information.main.temp_max-273.15);
  datafeellike.firstChild.nodeValue=Math.round(information.main.feels_like-273.15);
    }
    else{
    
     temperaturedatasymbol[0].firstChild.nodeValue='F';
     temperaturedatasymbol[1].firstChild.nodeValue='F';
     temperaturedatasymbol[2].firstChild.nodeValue='F';
     temperaturedatasymbol[3].firstChild.nodeValue='F';
     temperaturedatasection.firstChild.nodeValue= Math.round((information.main.temp-273.15)* 9/5 + 32);
     updata.firstChild.nodeValue=Math.round((information.main.temp_min-273.15)* 9/5 + 32);
  downdata.firstChild.nodeValue=Math.round((information.main.temp_max-273.15)* 9/5 + 32);
  datafeellike.firstChild.nodeValue=Math.round((information.main.feels_like-273.15)* 9/5 + 32);
    }
 
   }
   
// function placesloader(searchtext) for places to be loaded as we type the data is obtained from json data

function placesloader(searchtext)
{
  
  fetch('./data/cities.json')
  .then(res=>res.json())
  .then(data=>{
    var places=data.filter(place=>{ // filter is used in array to return an array based on set conditions
     const regex = new RegExp(`^${searchtext}`,'gi'); // specially designed for changing data
     //Using the constructor function provides runtime compilation of the regular expression.
     // Use the constructor function when you know the regular expression pattern will be changing,
     // or you don't know the pattern and are getting it from another source, such as user input.
     // g - Perform a global match (find all matches rather than stopping after the first match)
     // i Perform case-insensitive matching 
     //^ so it starts with
    
      return place.name.match(regex) || place.state.match(regex); // search the string within array for the searched keyword
    });

 if(searchtext.length==0)
places=[];


   displayplacechoices(places)
  })
  
}


///  function displayplacechoices(placechoice) dipslay the places matched from the json data
// based on typed keyword

function displayplacechoices(placechoice)
{
  outputplace.innerHTML='';
  placechoice.forEach(selection => {
    var freshplace = document.createElement('div');
    freshplace.innerHTML=`<h3>${selection.name} , ${selection.state}</h3>`;
    freshplace.addEventListener("click",()=>{
      place.value=selection.name;
    test();
    outputplace.innerHTML='';
  });
    outputplace.appendChild(freshplace);
  });
  
}




