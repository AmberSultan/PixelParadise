const apiKey=" PCahQ9jtQHzkX2qCeWsh4IGzXdSpCB1n8yIojyWjFUCXEWfpcR75mABI";
let perPage =15;
let currentPage  = 1;

const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".loadbtn");
const searchInput = document.querySelector(".search input");
let searchWord = null;
const previewBox = document.querySelector(".box");
const crossBtn = document.querySelector(".fa-xmark");
const downloadBtn = document.querySelector(".fa-download");


//function to download image
const downloadImg = (imgURL) =>{
//covert received image tgo blob , create its download link and download it
    fetch(imgURL)
    .then(res =>res.blob())  //A Blob (Binary Large Object) is a data type used to represent binary data in the form of files, such as images, videos, audio files, etc., in JavaScript. 
    .then(file =>{
        const a = document.createElement("a"); //this a represents anchor tag
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
        
    }).catch(()=>alert("Failed to download image!"));
}

//preview imgBox
const showBox = (name , img) =>{
    previewBox.querySelector("img").src = img;
    previewBox.querySelector("span").innerText = name;
    downloadBtn.setAttribute("data-img", img); //
    previewBox.classList.add("show");
}

// //hide preview imgBox
crossBtn.addEventListener('click', () =>{
    previewBox.classList.remove("show");
})

const generateHTML = (images) =>{
    //making li of all fetched images and add them into this image wrap
    imageWrapper . innerHTML += images.map(img =>
    `<li class="cards"  onclick="showBox('${img.photographer}' , '${img.src.large2x}')">
    <img src=${img.src.large2x} alt="pic1">
    <div class="details">
        <div class="photography">
            <i class="fa-solid fa-camera"></i>
            <span>${img.photographer}</span>
        </div>
        <button type="button" class="downloadBtn" onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
        <i class="fa-solid fa-download"></i>.
        </button>
    
    </div>
</li>`
    ).join("");
}

const getImage = (apiURL) => {
    //load More 
    loadMoreBtn.innerText = "Loading..";
    loadMoreBtn.classList.add("disabled");
    //fetch API by authorization header
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
    .then(res => res.json())
    .then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
       
    }).catch(() =>{
        alert("failed to load images")
    })
};

getImage(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

// load More function
loadMoreBtn.addEventListener('click' ,()=>{
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
//agar search word ma koi word ho ga then it call API with searchWord else call the simple/curated API
    apiURL = searchWord ? `https://api.pexels.com/v1/search?query=${searchWord}&page=${currentPage}&per_page=${perPage}` : apiURL;

    getImage(apiURL);
} );

// search images function

searchInput.addEventListener('keyup', (e)=>{

    //if search bar is empty then search will be null
    if(e.target.value === ""){
        return searchWord = null;
    }

    //when press Enter the images will update according to search word
    if(e.key === "Enter"){
         searchWord = e.target.value;
         imageWrapper . innerHTML = " ";
         getImage(`https://api.pexels.com/v1/search?query=${searchWord}&page=${currentPage}&per_page=${perPage}`)
    }
})

// downloadImg.addEventListener("click", downloadImg(e.target.dataset,img));
downloadBtn.addEventListener("click", (e) => {
    const imgURL = e.target.dataset.img;
    downloadImg(imgURL);
});
