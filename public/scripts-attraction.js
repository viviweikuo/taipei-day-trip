let attractionPath = location.pathname;
let attractionId = attractionPath.replace("/attraction/", "");

function fetchAttractionData(){

    fetch("http://127.0.0.1:3000/api/attraction/"+attractionId)
    .then((response) => {
        return response.json();
    })
    .then((attraction) => {

        for(let a in attraction){

            // 2. name
            let attractionName = document.querySelector(".product-booking-title");
            attractionName.textContent = attraction.data.name;

            // 3. category + "at" + mrt
            let attractionDirection = document.querySelector(".product-booking-direction");

            let attractionDirectionCategory = document.createElement("span");
            attractionDirectionCategory.classList.add("product-booking-direction-category");
            attractionDirectionCategory.textContent = attraction.data.category;

            let attractionDirectionMrt = document.createElement("span");
            attractionDirectionMrt.classList.add("product-booking-direction-mrt");
            attractionDirectionMrt.textContent = attraction.data.mrt;

            let attractionDirectionAt = document.querySelector(".product-booking-direction-at");
            attractionDirection.insertBefore(attractionDirectionCategory, attractionDirectionAt);
            attractionDirection.appendChild(attractionDirectionMrt);

            // 4. description
            let attractionArticle = document.querySelector(".product-introduction-article-content");
            attractionArticle.textContent = attraction.data.description;

            // 5. address
            let attractionAddress = document.querySelector(".product-introduction-address-content");
            attractionAddress.textContent = attraction.data.address;

            // 6. transport
            let attractionTransport = document.querySelector(".product-introduction-transport-content");
            attractionTransport.textContent = attraction.data.transport;

            // 1. images
            let attractionImageBox = document.querySelector(".images-container-box");

            for (let i in attraction.data.images){
                let attractionImageBoxSub = document.createElement("div");
                attractionImageBoxSub.classList.add("attraction-image-box");
                attractionImageBoxSub.classList.add("slide");
                attractionImageBoxSub.classList.add("fade");
                // attractionImageBoxSub.style.width = "auto";

                let attractionImage = document.createElement("img");
                attractionImage.classList.add("attraction-image");
                // attractionImage.style.width = "100%";
                attractionImage.src = attraction.data.images[i];

                attractionImageBoxSub.appendChild(attractionImage);
                attractionImageBox.appendChild(attractionImageBoxSub);

                let attractionImageDotBox = document.querySelector(".dots-box");
                attractionImageDotBox.innerHTML += "<span class='dot' onclick='currentSlide(n)'></span>";

                showSlide(slideIndex);
            }
        }
    })
    .catch((error) => {
        console.log(error);
    })
}
fetchAttractionData();

function checkPeriod(){
    
    let morningSchedule = document.querySelector(".product-booking-period-morning-btn-sub");
    let afternoonSchedule = document.querySelector(".product-booking-period-afternoon-btn-sub");
    let morningSchedulePrice = document.querySelector(".product-price-morning");
    let afternoonSchedulePrice = document.querySelector(".product-price-afternoon");

    morningSchedule.classList.toggle("btn-on");
    morningSchedule.classList.toggle("btn-off");

    afternoonSchedule.classList.toggle("btn-off");
    afternoonSchedule.classList.toggle("btn-on");

    morningSchedulePrice.classList.toggle("hide-text");
    afternoonSchedulePrice.classList.toggle("hide-text");

}
checkPeriod();

let slideIndex = 1;

function plusSlide(n){
    showSlide(slideIndex += n);
}

function currentSlide(n){
    showSlide(slideIndex = n);
}

function showSlide(n){

    let slides = document.getElementsByClassName("slide");

    if (n > slides.length){ slideIndex = 1; }
    if (n < 1){ slideIndex = slides.length; }

    for (let i = 0 ; i < slides.length ; i++){
        slides[i].style.display = "none";
    }

    slides[slideIndex-1].style.display = "block";
    dotsPlay();
}

function dotsPlay(){
    
    let dots = document.getElementsByClassName("dot");
    let dots_array = Array.from(dots);

    for (let j = 0 ; j < dots_array.length ; j++){
        dots_array[j].className = dots_array[j].className.replace(" dot-active", "");
    }

    dots_array[slideIndex-1].className += " dot-active";
}
function setDateMin(){
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10){
        dd = "0" + dd;
    }
    if (mm < 10){
        mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    document.querySelector(".date-input-box").setAttribute("min", today);
}
setDateMin();