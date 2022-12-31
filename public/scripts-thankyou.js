let orderNumber = new URL(location.href).searchParams
orderNumber = orderNumber.get("number")

function getOrderData(){

    fetch("http://127.0.0.1:3000/api/orders/" + orderNumber)
        .then((response) => {
            console.log(response)
            return response.json()
        })
        .then((data) => {
            console.log(data)

            if (data.data != null){
                document.querySelector(".order-number").innerHTML = data.data.number
            }
        })
}
getOrderData()
