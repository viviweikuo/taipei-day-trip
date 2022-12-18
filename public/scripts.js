// first fetch
let page = 0;
let keyword = document.querySelector(".search-attraction-input").value;
let attractionBox = document.querySelector(".attractions-box-sub");

let isLoading = false;

function fetchData(){

    isLoading = true;

	fetch("http://18.213.194.28:3000/api/attractions?page="+page+"&keyword="+keyword)
        .then((response) => {
            return response.json();
        })
        .then((attractions) => {

            if (attractions.data == null){
                attractionBox.innerHTML = "沒有相關資料";
            } else {
                for (let i = 0 ; i < attractions.data.length ; i++){
            
                    // 0. 小格子: 圖+景點名
                    let attractionSubBoxImg = document.createElement("div");
                    attractionSubBoxImg.classList.add("attractions-box-single-product");
        
                    // 1. 分寫網址 + 載入第一章圖片
                    let imgLinkElement = document.createElement("a");
                    imgLinkElement.href = "http://18.213.194.28:3000/attraction/" + attractions.data[i].id;
        
                    let imgElement = document.createElement("img");
                    imgElement.classList.add("attractions-box-single-img");
                    imgElement.src = attractions.data[i].images[0];
        
                    imgLinkElement.appendChild(imgElement);
                    attractionSubBoxImg.appendChild(imgLinkElement);
                    
                    // 2. 景點名稱
                    let nameLinkElement = document.createElement("a");
                    nameLinkElement.href = "http://18.213.194.28:3000/attraction/" + attractions.data[i].id;
        
                    let nameBoxElement = document.createElement("div");
                    nameBoxElement.classList.add("attractions-box-single-name-box");
        
                    let nameElement = document.createElement("span");
                    nameElement.classList.add("attractions-box-single-name");
                    nameElement.textContent = attractions.data[i].name;
        
                    nameBoxElement.appendChild(nameElement);
                    nameLinkElement.appendChild(nameBoxElement);
                    attractionSubBoxImg.appendChild(nameLinkElement);
        
                    // 3. 小格子: 捷運+分類
                    let attractionSubBoxText = document.createElement("div");
                    attractionSubBoxText.classList.add("attractions-box-single-text");
        
                    // 4. 捷運站名
                    let mrtElement = document.createElement("span");
                    mrtElement.classList.add("attractions-box-single-mrt");
                    mrtElement.textContent = attractions.data[i].mrt;
                    attractionSubBoxText.appendChild(mrtElement);
        
                    // 5. 分類
                    let catElement = document.createElement("span");
                    catElement.classList.add("attractions-box-single-cat");
                    catElement.textContent = attractions.data[i].category;
                    attractionSubBoxText.appendChild(catElement);
        
                    // 6. 大格子+插入網頁
                    let attractionSubBox = document.createElement("div");
                    attractionSubBox.classList.add("attractions-box-single");
                    attractionSubBox.appendChild(attractionSubBoxImg);
                    attractionSubBox.appendChild(attractionSubBoxText);
                    attractionBox.appendChild(attractionSubBox);
        
                    // 7. 紀錄nextPage
                    nextPage = attractions.nextPage;
        
                    isLoading = false;
        
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
}
fetchData();

// search by category or keyword
function sendSearchData(){
    let page = 0;
    let keyword = document.querySelector(".search-attraction-input").value;

    const request = new XMLHttpRequest();
    request.open("GET", "/api/attractions?page="+page+"&keyword="+keyword);
    request.send();
    
    cleanSearchData();
    getSearchData();
}

function cleanSearchData(){
    let attractionBox = document.querySelector(".attractions-box");
    let attractionBoxSubOld = document.querySelector(".attractions-box-sub");
    let attractionBoxSubNew = document.createElement("div");
    attractionBoxSubNew.classList.add("attractions-box-sub");
    attractionBox.replaceChild(attractionBoxSubNew, attractionBoxSubOld);
}

function getSearchData(){

    isLoading = true;

    if (!page){
        page = 0;
        keyword = document.querySelector(".search-attraction-input").value;
    }

	fetch("http://18.213.194.28:3000/api/attractions?page="+page+"&keyword="+keyword)
        .then((response) => {
            return response.json();
        })
        .then((attractions) => {

            if (attractions.data == null){
                attractionBox.innerHTML = "沒有相關資料";
            } else {
                for (let i = 0 ; i < attractions.data.length ; i++){
            
                    // 0. 小格子: 圖+景點名
                    let attractionSubBoxImg = document.createElement("div");
                    attractionSubBoxImg.classList.add("attractions-box-single-product");
        
                    // 1. 分寫網址 + 載入第一章圖片
                    let imgLinkElement = document.createElement("a");
                    imgLinkElement.href = "http://18.213.194.28:3000/attraction/" + attractions.data[i].id;
        
                    let imgElement = document.createElement("img");
                    imgElement.classList.add("attractions-box-single-img");
                    imgElement.src = attractions.data[i].images[0];
        
                    imgLinkElement.appendChild(imgElement);
                    attractionSubBoxImg.appendChild(imgLinkElement);
                    
                    // 2. 景點名稱
                    let nameLinkElement = document.createElement("a");
                    nameLinkElement.href = "http://18.213.194.28:3000/attraction/" + attractions.data[i].id;
        
                    let nameBoxElement = document.createElement("div");
                    nameBoxElement.classList.add("attractions-box-single-name-box");
        
                    let nameElement = document.createElement("span");
                    nameElement.classList.add("attractions-box-single-name");
                    nameElement.textContent = attractions.data[i].name;
        
                    nameBoxElement.appendChild(nameElement);
                    nameLinkElement.appendChild(nameBoxElement);
                    attractionSubBoxImg.appendChild(nameLinkElement);
        
                    // 3. 小格子: 捷運+分類
                    let attractionSubBoxText = document.createElement("div");
                    attractionSubBoxText.classList.add("attractions-box-single-text");
        
                    // 4. 捷運站名
                    let mrtElement = document.createElement("span");
                    mrtElement.classList.add("attractions-box-single-mrt");
                    mrtElement.textContent = attractions.data[i].mrt;
                    attractionSubBoxText.appendChild(mrtElement);
        
                    // 5. 分類
                    let catElement = document.createElement("span");
                    catElement.classList.add("attractions-box-single-cat");
                    catElement.textContent = attractions.data[i].category;
                    attractionSubBoxText.appendChild(catElement);
        
                    // 6. 大格子+插入網頁
                    let attractionSubBox = document.createElement("div");
                    attractionSubBox.classList.add("attractions-box-single");
                    attractionSubBox.appendChild(attractionSubBoxImg);
                    attractionSubBox.appendChild(attractionSubBoxText);

                    let attractionBoxSubNew = document.querySelector(".attractions-box-sub");
                    attractionBoxSubNew.appendChild(attractionSubBox);
        
                    // 7. 紀錄nextPage
                    nextPage = attractions.nextPage;
                    keyword = keyword;
        
                    isLoading = false;
        
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })

    observer.observe(loadingObserver);
}

// category box
function fetchCategories(){

	fetch("http://18.213.194.28:3000/api/categories")
    .then((response) => {
        return response.json();
    })
    .then((category) => {
        
        // 設定成不可視
        let dropdownMenuContainer = document.querySelector(".dropdown-menu-container");
        dropdownMenuContainer.classList.add("hide-content");

        // 將item插入網頁
        let dropdownMenuBox = document.createElement("div");
        dropdownMenuBox.classList.add("dropdown-menu-box");

        for (let i = 0 ; i < category.data.length ; i++){
            let dropdownMenuItem = document.createElement("div");
            dropdownMenuItem.classList.add("dropdown-menu-item");
            dropdownMenuItem.textContent = category.data[i];
            dropdownMenuBox.appendChild(dropdownMenuItem);
        }

        dropdownMenuContainer.appendChild(dropdownMenuBox);

    })
    .catch((error) => {
        console.log(error);
        
    })
}
fetchCategories();

function controlCategoryBox(){
    let dropdownMenuContainer = document.querySelector(".dropdown-menu-container");

    let clickTarget = document.querySelector(".search-attraction-input");
    clickTarget.addEventListener("click", () => {
        dropdownMenuContainer.classList.add("open-content");
        dropdownMenuContainer.classList.remove("hide-content");
        selectCategoryItem();
    }, true);

    window.addEventListener("click", () => {
        dropdownMenuContainer.classList.remove("open-content");
        dropdownMenuContainer.classList.add("hide-content");
    }, true);
}
controlCategoryBox();

function selectCategoryItem(){

    let dropdownMenuItems = document.getElementsByClassName("dropdown-menu-item");
    let inputTarget = document.querySelector(".search-attraction-input");

    for (let i = 0 ; i < dropdownMenuItems.length ; i++){
        dropdownMenuItems[i].onclick = function(){
            inputTarget.value = dropdownMenuItems[i].textContent;
        }
    }
}

// scroll management
const loadingObserver = document.querySelector(".footer");

const options = {
	root: null,
	rootMargin: "0px",
	threshold: 0
}

function callback([entry]){
	if (entry.isIntersecting && !isLoading){
		if (keyword == "" && nextPage != null){
            page = nextPage;
			fetchData();
            observer.observe(loadingObserver);
		} 
        else if (keyword != "" && nextPage != null){
            page = nextPage;
            getSearchData();
            observer.observe(loadingObserver);
        }  
        else {
            page = 0;
			observer.unobserve(loadingObserver);
            observer.disconnect(loadingObserver);
		}
	} 
}

const observer = new IntersectionObserver(callback, options);
observer.observe(loadingObserver);