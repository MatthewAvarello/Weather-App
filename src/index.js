import "./style.css";
console.log("Webpack template!");
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
        precipitationprobability: data.currentConditions.precipitationprobability,
        description: data.description,
        icon: data.currentConditions.icon
    }
    console.log("Processing Data")
    console.log(relevantData)
    return relevantData
}
function UpdateDom(){

}
async function Main(location){
    let weatherdata = await GetWeatherData(location)

    if(weatherdata){
        ProcessData(weatherdata)
    }

    // Will eventually call updatedom and other functions here after i have made them. Everything is in one js file as this is a small project with low scope
}

Main('Toronto')
Main('Tokyo')