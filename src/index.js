import "./style.css";

let form = document.querySelector("form")
let input = document.querySelector("#MainInput")
let toggletempbutton = document.querySelector("#toggletemp")
function toggletemp(){
    if(toggletempbutton.getAttribute("data-temptype") == "C"){
        toggletempbutton.setAttribute("data-temptype","F")
        toggletempbutton.textContent = "F°"
    } else {
        toggletempbutton.setAttribute("data-temptype","C")
        toggletempbutton.textContent = "C°"
    }
}
toggletempbutton.addEventListener("click", toggletemp)
form.addEventListener('submit',(event) => {
    event.preventDefault()
    Main(input.value)
} );

async function GetWeatherData(location){
    try{
        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&key=EVNU8SLUCWZCQKN2YKU82VNWL&contentType=json`)
        if (!response.ok){
            throw new Error("Error Catching Data. Status:" + response.status)
        }
        let data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.error(error)
    }
    
}
function ProcessData(data){
    let relevantData = {
        condition: data.currentConditions.conditions,
        resolvedAddress: data.resolvedAddress,
        alert: data.alerts,
        feelslike: data.currentConditions.feelslike,
        temperature: data.currentConditions.temp,
        precipitationprobability: data.currentConditions.precipprob,
        description: data.description,
        icon: data.currentConditions.icon
    }
    console.log("Processing Data")
    console.log(relevantData)
    return relevantData
}
async function GetIcon(iconName) {
    try {
        const icon = await import(`./images/WeatherSvg/${iconName}.svg`);
        return icon.default;
    } catch {
        console.error(`Missing icon for ${iconName}`);
        return null;
    }
}
const DomController = (function(){
    let condition = document.querySelector("#condition")
    let resolvedaddress = document.querySelector("#resolvedaddress")
    let weathersymbol = document.querySelector("#weathersymbol")
    let temperature = document.querySelector("#temperature")
    let precipitationprobability = document.querySelector("#precprob")
    let description = document.querySelector("#description")
    let alert = document.querySelector("#alert")
    let maingrid = document.querySelector('.grid')
    async function UpdateDom(data){
        HideWeather()
        condition.textContent = data.condition
        resolvedaddress.textContent = data.resolvedAddress
        precipitationprobability.textContent = data.precipitationprobability + "% Chance of rain"
        description.textContent = data.description
        let iconname = data.icon
        let iconsrc = await GetIcon(iconname)
        weathersymbol.setAttribute("src",iconsrc)
        if(data.alert.length > 0){
            let alertobject = data.alert[0]
            alert.textContent = alertobject.description
        } else{
            alert.textContent = "No Active Alerts"
        }
        if (toggletempbutton.getAttribute("data-temptype") == "C"){
            temperature.textContent = `Temperature: ${data.temperature}C° Feels Like: ${data.feelslike}C°`
        } else {
            temperature.textContent = `Temperature: ${(data.temperature*9/5) + 32}F° Feels Like: ${(data.feelslike*9/5) + 32}F°`
        }
       
        ShowWeather()
    }
    function HideWeather (){
        maingrid.style.display = 'none'
    }
    function ShowWeather(){
        maingrid.style.display = 'grid'
    }
    return{UpdateDom,HideWeather,ShowWeather}
})()
async function Main(location){
    let weatherdata = await GetWeatherData(location)

    if(weatherdata){
        let proccesseddata = ProcessData(weatherdata)
        DomController.UpdateDom(proccesseddata)
    }

    
    // Will eventually call updatedom and other functions here after i have made them. Everything is in one js file as this is a small project with low scope
}

