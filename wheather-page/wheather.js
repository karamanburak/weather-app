//^ ---------------------------------- */
//^              SELECTORS             */
//^ ---------------------------------- */

const form = document.querySelector("form");
const input = document.querySelector("form input");
const cardContainer = document.getElementById("card-container");
const alertMessage = document.querySelector(".alert");
const searchInput = document.getElementById("search")
const searchBtn = document.querySelector(".btn")

//^ ---------------------------------- */
//^              VARIABLES             */
//^ ---------------------------------- */

const API_KEY = "7b87bae94c640957b92a90ddbc030fc4";
let url; // Api istegi icin kullanilacak
let cities = []; // Sergilenen sehirlerin isimleri tutulacak
let units = "metric"; // fahrenheit icin 'imperial' yazilmali
let lang = "en"; // Almanca icin 'de' yazilacak

//^ ---------------------------------- */
//^            LOCATION FIND           */
//^ ---------------------------------- */
const locate = document.getElementById("locate");
const userLocationDiv = document.getElementById("userLocation");

let userLocation = false


//& Language

const langBtn = document.querySelector(".language")


//^ ---------------------------------- */
//^          EVENT LISTENERS           */
//^ ---------------------------------- */

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Default özelligini kullanma yani submit etme
    // console.log(city);

    if (input.value) {

        const city = input.value;
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${API_KEY}`;
        // console.log(url);
        getWeatherData();
    }

    form.reset(); //formu sifirlar
});


locate.addEventListener("click", () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
        console.log(coords);

        const { latitude, longitude } = coords


        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${API_KEY}`
        userLocation = true
        getWeatherData()


    })

})





document.querySelectorAll("img").forEach((country)=>(country.onclick=()=>{

// console.log(country.id);
    if (country.id == "de") {     
        input.setAttribute("placeholder", "Suche nach einer Stadt")
        lang = "de"
        searchBtn.textContent="Suche"

    } else if (country.id == "en") {
        input.setAttribute("placeholder", "Search for a city")
        lang = "en"
        searchBtn.textContent="Search"
    } else if (country.id == "tr"){
        input.setAttribute("placeholder", "Lütfen bir sehir giriniz")
        lang = "tr"
        searchBtn.textContent="Ara"
    }

})
)



searchInput.addEventListener("click", (e) => {
    e.preventDefault(); // Default özelligini kullanma yani submit etme
    // console.log(city);

    if (input.value) {

        const city = input.value;
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${API_KEY}`;
        // console.log(url);
        getWeatherData();
    }

    input.value = ''; //formu sifirlar
});

//^ ---------------------------------- */
//^              FUNCTIONS             */
//^ ---------------------------------- */

const getWeatherData = async () => {
    try {
        // const response = await fetch(url).then((response) => response.json()); //& fetch ile

        const response = await axios(url) //^ axios ile istek atma


        // console.log(response); //& Api den gelen veri


        //? DATA DESTRUCTURE
        // const { main, name, weather, sys } = response; //& fetch
        const { main, name, weather, sys } = response.data; //^ axios



        // console.log(weather[0].icon)
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`; //^ openweathermap.org

        // const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg` //^ alternatif

        if (cities.indexOf(name) == -1) {

            cities.unshift(name);
            // console.log(cities);

            let card = `       
            <div class="col d-flex align-items-stretch " id="${name}">
<div class="card mb-4 rounded-3 shadow-sm ">
        <ul class="list-unstyled mt-2 mb-4 ">
            <li class="text-end me-2"><i class="bi bi-x-circle"></i></li>
            <h4 class="my-0 fw-normal">${name} <span ><sup><img src="https://flagsapi.com/${sys.country
                }/shiny/24.png" class="rounded-circle" alt=${sys.country
                }/> </sup></span></h4>
            <h1 class="card-title pricing-card-title"><i class="bi bi-thermometer-half"></i> ${Math.round(
                    main.temp
                )}<sup>°C</sup></h1>
            <h6 class="card-title pricing-card-title">Min : ${Math.round(
                    main.temp_min
                )}<sup>°C</sup> - Max : ${Math.round(
                    main.temp_max
                )}<sup>°C</sup>  </h6>
            <h6 class="card-title pricing-card-title"><img src="../assets/wi-barometer.svg" height="30px"/>${main.pressure
                } <img src="../assets/wi-humidity.svg" height="30px"/>${main.humidity
                } </h6>
            <li><img src="${iconUrl}"/></li>
            <li>${weather[0].description.toUpperCase()}</li>
        </ul>
</div>
</div>`;

            if (userLocation) {
                userLocationDiv.innerHTML = card
                userLocation = false
            } else {

                cardContainer.innerHTML = card + cardContainer.innerHTML;
            }



            //! Remove Cities

            const singleClearButton = document.querySelectorAll(".bi-x-circle");

            singleClearButton.forEach((button) => {
                button.addEventListener("click", (e) => {
                    console.log(e.target.closest(".col").id);

                    // cities.splice(cities.indexOf(e.target.closest(".col").id), 1) // development asamasinda

                    delete cities[cities.indexOf(e.target.closest(".col").id)] //! Array den siler

                    e.target.closest(".col").remove() //! Dom'dan siler



                });
            });




        } else {

            if (lang == "de") {
                alertMessage.textContent = `Sie kennen das Wetter für die ${name} bereits. Bitte suchen Sie nach einer anderen Stadt 😉`;
              
            }else if (lang  == "tr"){
                alertMessage.textContent = `${name} icin hava durumunu biliyorsunuz lütfen baska bir sehir arayiniz 😉`;
        }
            else {

                alertMessage.textContent = `You already know the weather for ${name}, Please search for another city 😉`;
            }
            alertMessage.classList.replace("d-none", "d-block")

            setTimeout(() => {
                alertMessage.classList.replace("d-block", "d-none")
            }, 3000)
        }


    } catch (error) {

        if (lang == "de") {
            alertMessage.textContent = `Die Stadt wurde nicht gefunden!`;
        }else if (lang == "tr"){
            alertMessage.textContent = `Sehir bulunamadi!`;

        } 
        
        else {

            alertMessage.textContent = `City Not Found!`;
        }

        alertMessage.classList.replace("d-none", "d-block")

        setTimeout(() => {
            alertMessage.classList.replace("d-block", "d-none")
        }, 3000)
    }

}