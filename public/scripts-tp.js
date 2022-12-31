// 2. Setup SDK
TPDirect.setupSDK(127146, 'app_TFVLpH1527pFlbEaBew9ts29ld37FdzMpxI1QYHMkzuUnwRycD67iDM7mfLU', 'sandbox')

// 3. TPDirect.card.setup(config)
// 以下提供必填 CCV 以及選填 CCV 的 Example
// 必填 CCV Example
TPDirect.card.setup({
    fields: {
        number: {
            element: document.querySelector('.card-number'),
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.querySelector('.card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: document.querySelector('.card-ccv'),
            placeholder: 'CCV'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})

// 4. onUpdate
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    const submitButton = document.querySelector('.booking-schedule-confirm-btn')
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
    }

    // FIXME: 過期日&CCV的綠框顯示不出來 classList讀不到
    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
    } else {
        setNumberFormGroupToNormal('.card-number-group')
    }
    
    if (update.status.expiry === 2) {
        setNumberFormGroupToError('card-expiration-date-group')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('card-expiration-date-group')
    } else {
        setNumberFormGroupToNormal('card-expiration-date-group')
    }
    
    if (update.status.ccv === 2) {
        setNumberFormGroupToError('.card-ccv-group')
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.card-ccv-group')
    } else {
        setNumberFormGroupToNormal('.card-ccv-group')
    }
})

// 5. Get Tappay Fields Status
// 6. Get Prime
// call TPDirect.card.getPrime when user submit form to get tappay prime
function onSubmit(event) {
    event.preventDefault()

    // fix keyboard issue in iOS device
    // forceBlurIos()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('Can not get prime!')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('Get prime error! ' + result.msg)
            return
        }
        alert('Get prime successful, prime: ' + result.card.prime)

        fetch("http://127.0.0.1:3000/api/booking")
            .then((response) => {
                return response.json();
            })
            .then((booking) => {

                let contactName = document.querySelector(".contact-information-name-input").value
                let contactEmail = document.querySelector(".contact-information-email-input").value
                let contactPhone = document.querySelector(".contact-information-mobile-input").value
                let orderData = {
                    "prime": result.card.prime,
                    "order": {
                        "price": booking.data.price,
                        "trip": {
                            "attraction": {
                                "id": booking.data.attraction.id,
                                "name": booking.data.attraction.name,
                                "address": booking.data.attraction.address,
                                "image": booking.data.attraction.images
                            },
                            "date": new Date(booking.data.date).toISOString().slice(0, 10),
                            "time": booking.data.time
                        },
                        "contact": {
                            "name": contactName,
                            "email": contactEmail,
                            "phone": contactPhone
                        }
                    }
                }
                console.log(orderData)
                return fetch("http://127.0.0.1:3000/api/orders", { 
                            method: "POST",
                            body: JSON.stringify(orderData),
                            headers: {
                                "content-type": "application/json",
                                "Accept": "application/json",
                            }})
            })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                let orderNumber = result.data.number
                let url = "/thankyou?number=" + encodeURIComponent(orderNumber)
                location.href = url
            })
            .catch((error) => {
                console.log(error)
            })
    })

}

function setNumberFormGroupToError(selector) {
    document.querySelector(selector).classList.add('has-error')
    document.querySelector(selector).classList.remove('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    document.querySelector(selector).classList.add('has-success')
    document.querySelector(selector).classList.remove('has-error')

}

function setNumberFormGroupToNormal(selector) {
    document.querySelector(selector).classList.remove('has-error')
    document.querySelector(selector).classList.remove('has-success')
}

function forceBlurIos() {
    if (!isIos()) {
        return
    }
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input)
    input.focus()
    input.parentNode.removeChild(input)
}

function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}