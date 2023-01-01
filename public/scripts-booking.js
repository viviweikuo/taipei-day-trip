function goBookingCar(){

    fetch("http://18.213.194.28:3000/api/user/auth", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            if (result.data == null){
                let membershipForm = document.querySelector(".membership-container");
                membershipForm.style.removeProperty("display");
                membershipForm.style.display = "block";
                let backgroundGray = document.querySelector(".background-layer");
                backgroundGray.style.removeProperty("display");
                backgroundGray.style.display = "block";
            } else {
                location.replace("/booking");
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function fetchBookingInfo(){

    fetch("http://18.213.194.28:3000/api/booking")
        .then((response) => {
            return response.json();
        })
        .then((booking) => {

            // info turn on
            let bookingBox = document.querySelector(".booking-content");
            let noBookingBox = document.querySelector(".no-booking-content");
            if (booking.data != null){
                noBookingBox.classList.remove("open-content");
                noBookingBox.classList.add("hide-content");

                bookingBox.classList.add("open-content");
                bookingBox.classList.remove("hide-content");
            } else {
                bookingBox.classList.remove("open-content");
                bookingBox.classList.add("hide-content");
                
                noBookingBox.classList.remove("hide-content");
                noBookingBox.classList.add("open-content");
            }
            
            // img
            let bookingImgBox = document.querySelector(".booking-information-img-box");
            let bookingImgBoxSub = document.createElement("div");
            bookingImgBoxSub.classList.add("booking-information-img-box-sub");
            let bookingImg = document.createElement("img");
            bookingImg.classList.add("booking-information-img");
            bookingImg.src = booking.data.attraction.images;
            bookingImgBoxSub.appendChild(bookingImg);
            bookingImgBox.appendChild(bookingImgBoxSub);
            // title
            let bookingTitleName = document.querySelector(".booking-title-name");
            bookingTitleName.textContent = booking.data.attraction.name;
            // date
            let bookingDate = document.querySelector(".booking-date-body");
            let bookingDateOj = new Date(booking.data.date);
            bookingDateOj = bookingDateOj.toISOString().slice(0, 10);
            bookingDate.textContent = bookingDateOj;
            // time
            let bookingTime = document.querySelector(".booking-time-body");
            if (booking.data.time == "morning"){
                bookingTime.textContent = "上午 09:00 - 12:00";
            }
            if (booking.data.time == "afternoon"){
                bookingTime.textContent = "下午 01:00 - 04:00";
            }
            // price
            let bookingPrice = document.querySelector(".booking-price-body");
            bookingPrice.textContent = booking.data.price;
            let bookingConfirmPrice = document.querySelector(".booking-schedule-confirm-price");
            bookingConfirmPrice.textContent = booking.data.price;
            // address
            let bookingAddress = document.querySelector(".booking-address-body");
            bookingAddress.textContent = booking.data.attraction.address;
        
        })
}

function bookSchedule(){

    let bookingDate = document.querySelector(".booking-date-input").value;
    let bookingTime;
    let bookingPrice;

    let bookMorning = document.querySelector(".product-booking-period-morning-btn-sub");
    if (bookMorning.classList.contains("btn-on")){
        bookingTime = "morning";
        bookingPrice = 2000;
    };
    let bookAfternoon = document.querySelector(".product-booking-period-afternoon-btn-sub");
    if (bookAfternoon.classList.contains("btn-on")){
        bookingTime = "afternoon";
        bookingPrice = 2500;
    }

    let bookingData = {
        "attractionId": attractionId,
        "date": bookingDate,
        "time": bookingTime,
        "price": bookingPrice
    }
    
    fetch("http://18.213.194.28:3000/api/booking", {
        method: "POST",
        body: JSON.stringify(bookingData),
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
        }
    })
        .then((response) => {
            console.log(response);
            if (response.status == 403){
                let membershipForm = document.querySelector(".membership-container");
                membershipForm.style.removeProperty("display");
                membershipForm.style.display = "block";
                let backgroundGray = document.querySelector(".background-layer");
                backgroundGray.style.removeProperty("display");
                backgroundGray.style.display = "block";
            }
            return response.json();
        })
        .then((result) => {

            if (result["ok"]){
                goConfirmBooking();
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function goConfirmBooking(){

    fetch("http://18.213.194.28:3000/api/user/auth", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            if (result.data == null){
                location.replace("/");
            } else {
                location.replace("/booking");
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function deleteSchedule(){

    fetch("http://18.213.194.28:3000/api/booking", {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {

            if (result["ok"]){
                location.reload();

            }
        })
        .catch((error) => {
            console.log(error)
        })
}