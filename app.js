const userTab = document.querySelector("[dataUserWeather]");
const searchTab = document.querySelector("[dataSearchWeather]");
const searchForm = document.querySelector(".searchForm");
const userWeatherInfo = document.querySelector(".userWeatherInfo");
const errorPage = document.querySelector(".errorPage");
const loading = document.querySelector(".loading");
const windspeedInfo = document.querySelector("[windspeedInfo]");
const humidityInfo = document.querySelector("[humidityInfo]");
const cloudsInfo = document.querySelector("[cloudsInfo]");
const city = document.querySelector("[city]");
const countryFlag = document.querySelector("[countryFlag]");
const weatherCondition = document.querySelector("[weatherCondition]");
const weatgerIcon = document.querySelector("[weatgerIcon]");
const temperature = document.querySelector("[temperature]");
const grantAccess = document.querySelector(".grantAccess");
const locationAccessBtn = document.querySelector("[locationAccessBtn]");

let currentTab = userTab;
const API_KEY = "d9f8a69471bfc1e3887f611dc5ac1f7a";
currentTab.classList.add("currentTab");
grantAccess.classList.add("active");

function toogleTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("currentTab");
        currentTab=clickedTab;
        currentTab.classList.add("currentTab");
        if(!searchForm.classList.contains("active")){
            userWeatherInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userWeatherInfo.classList.remove("active");
            getFromSessionStorage();
        }
    }

}
userTab.addEventListener("click",()=>{
    toogleTab(userTab);
});
searchTab.addEventListener("click",()=>{
    toogleTab(searchTab);
});

function render(data){
    city.innerText = data?.name;
    const countryURL = data?.sys?.country;
    countryFlag.setAttribute('src',`https://flagcdn.com/w320/${countryURL.toLowerCase()}.png`);
    weatherCondition.innerText = data?.weather?.[0]?.main;
    const iconURL = data?.weather?.[0]?.icon;
    weatgerIcon.setAttribute('src',`https://openweathermap.org/img/wn/${iconURL}@2x.png`);
    temperature.innerText = `${data?.main?.temp}\u00B0C`;
    windspeedInfo.innerText = `${data?.wind?.speed} m/sec`;
    humidityInfo.innerText = `${data?.main?.humidity}%`;
    cloudsInfo.innerText = `${data?.clouds?.all}%`;
}



searchForm.addEventListener("submit",async (event) =>{
    event.preventDefault(); 
    const city = new FormData(searchForm).get('city').toLowerCase();
    try{
    loading.classList.add("active");
    let res =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    let data = await res.json();
    render(data);
    if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }
    console.dir(data);
    loading.classList.remove("active");
    userWeatherInfo.classList.add("active");
    errorPage.classList.remove("active");
    }
    catch(err){
        loading.classList.remove("active");
        userWeatherInfo.classList.remove("active");
        errorPage.classList.add("active");
    }
})

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("userCoordinate");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,longi} = coordinates;
    grantAccess.classList.remove("active");
    loading.classList.add("active");
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        loading.classList.remove("active");
        userWeatherInfo.classList.add("active");
        render(data);
    }
    catch(err){
        loading.classList.remove("active");
        errorPage.classList.add("active");
    }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        errorPage.classList.add("active");
    }
}

function showPosition(position){

    console.log(`${position.coords.latitude} ${position.coords.longitude}`);
    const user = {
        lat:position.coords.latitude,
        // lat:26.730556,
        // longi:83.439306,
        longi:position.coords.longitude,
    }

    sessionStorage.setItem("userCoordinate",JSON.stringify(user));
    fetchUserWeatherInfo(user);
}

locationAccessBtn.addEventListener("click",getLocation);