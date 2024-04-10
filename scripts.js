/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 * 
 */

// function quoteAlert() {
//     console.log("Button Clicked!")
//     alert("I guess I can kiss heaven goodbye, because it got to be a sin to look this good!");
// }

// function removeLastCard() {
//     titles.pop(); // Remove last item in titles array
//     showCards(); // Call showCards again to refresh
// }

/**
 * edits the html content of a card with given coffee data
 * @param {HTMLElement} card - card element
 * @param {Coffee} coffee - coffee data
 */
function editCardContent(card, coffee) {
    // card.style.width = "15rem";
    // card.firstElementChild.classList.add("card-flex");
    card.querySelector('h2').textContent = coffee.name;
    card.querySelector('.card-content-roast p:nth-child(1)').textContent = coffee.roaster;
    card.querySelector('.card-content-roast p:nth-child(2)').textContent = coffee.roast;
    card.querySelector('.card-content-location p:nth-child(1)').textContent = "Loc: " + coffee.countryLocation;
    card.querySelector('.card-content-location p:nth-child(2)').textContent = "Org: " + coffee.origin;
    const price = card.querySelector('.card-content-price');
    price.textContent = coffee.getUsdPrice();
    price.style.margin = "0.25rem";
    const rating = card.querySelector('.card-content-rating');
    rating.textContent = coffee.getRating();
    rating.style.margin = "0.25rem";
    const review = card.querySelector('.card-content-review');
    review.textContent = coffee.review;
    const reviewDate = card.querySelector('.card-content-date');
    reviewDate.textContent = coffee.readableReviewDate;
    // console.log("new card:", coffee.name, "- html: ", card);
    const countryImage = card.querySelector("#card-country-image");
    countryImage.src = coffee.imageUrl;
    countryImage.alt = coffee.loc_country;
    countryImage.style.width = "40%";    
    countryImage.style.objectFit = "contain";
    const roastImage = card.querySelector("#card-roast-image");
    roastImage.src = coffee.roastImageUrl;
    roastImage.alt = coffee.roast;
    roastImage.style.width = "40%";    
    roastImage.style.objectFit = "scale-down";
}

/**
 * @type {Array.<Coffee>}
 */
const coffees = [];
/**
 * @type {Array.<Coffee>}
 */
let filteredCoffees = []

const fetchCoffeeData = async() => {
    // dataset source: https://www.kaggle.com/datasets/schmoyote/coffee-reviews-dataset?select=simplified_coffee.csv
    try {
        const coffeesPayback = await fetch("./simplified_coffee.csv")
        const coffeesText = await coffeesPayback.text();
        const coffessParsedText = Papa.parse(coffeesText, { header: true});
        Coffee.metadata = coffessParsedText.meta;

        const roastSet = new Set();
        const locationSet = new Set();

        for(let coffee of coffessParsedText.data){
            const coffeeObject = new Coffee(coffee);
            coffees.push(coffeeObject); 
            filteredCoffees.push(coffeeObject);

            roastSet.add(coffeeObject.roast);
            locationSet.add(coffeeObject.countryLocation);
        }
        console.log(roastSet);// TESTING
        console.log(locationSet);// TESTING
    } catch (error) {
        console.error('Error:', error);
    }
};

const injectCoffeeCardsIntoDom = () => {
    // console.log("injectCoffee called"); // TESTING
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");
    for (let i = 0; i < filteredCoffees.length; i++) {
        const coffee = filteredCoffees[i];
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editCardContent(nextCard, coffee); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
    }
    console.log("cardcontaainer children:", cardContainer.children.length); // testing
};

// pagination feature

const initPagination = () => {
    const cardsPerPage = 8;
    const cardContainer = document.getElementById("card-container");
    const prevButton = document.getElementById('prev'); 
    const nextButton = document.getElementById('next'); 
    const pageNumbers = document.getElementById('page-numbers'); 
    const pageLinks = document.querySelectorAll('.page-link');
    const cards = Array.from(cardContainer.getElementsByClassName('card'));
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    let pageIndex = 1;
    // const pagination = document.getElementById('pagination'); 
    // setCardsInPagination();
    /**
     * displays a certain page by partitioning a section of the Coffee array
     * @param {number} page - the pagination page index
     */
    const displayPage = (page) => {
        const startIndex = (page - 1) * cardsPerPage; 
        const endIndex = startIndex + cardsPerPage; 
        console.log("displayPage(startIndex, endIndex, page):", startIndex, endIndex, page); // TESTING
        cards.forEach((card, i) => { 
            if (i >= startIndex && i < endIndex) { 
                card.style.display = 'block'; 
            } else { 
                card.style.display = 'none'; 
            } 
        }); 
    };
    /**
     * updates pagination buttons and page numbers
     */
    const updatePagination = () => { 
        pageNumbers.textContent = `Page ${pageIndex} of ${totalPages}`; 
        prevButton.disabled = pageIndex === 1; 
        nextButton.disabled = pageIndex === totalPages; 
        pageLinks.forEach((link, index) => { 
            const page = parseInt(link.getAttribute('data-page')); 
            console.log("updatePag:", page)//TESTING    
            link.classList.toggle('active', page === pageIndex); 
        }); 
    };

    // adds event listener for previous button
    prevButton.addEventListener('click', (event) => { 
        event.preventDefault();
        if (pageIndex > 1) { 
            pageIndex--; 
            displayPage(pageIndex); 
            updatePagination(); 
        } 
    }); 
    // adds event listener for Next button
    nextButton.addEventListener('click', (event) => { 
        event.preventDefault();
        if (pageIndex < totalPages) { 
            pageIndex++; 
            displayPage(pageIndex); 
            updatePagination(); 
        } 
    }); 
    // adds event listener for page number buttons
    pageLinks.forEach((link) => { 
        link.addEventListener('click', (event) => { 
            event.preventDefault(); 
            const page = parseInt(link.getAttribute('data-page')); 
            if (page !== pageIndex) { 
                pageIndex = page; 
                displayPage(pageIndex); 
                updatePagination(); 
            } 
        }); 
    }); 
    displayPage(pageIndex);
    updatePagination();
};
//  pagination feature ends

// searching feature
const searchInputSubmit = (event) => {
    event.preventDefault();
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const roastSelect = document.getElementById('roast').value.toLowerCase();
    const locationSelect = document.getElementById('location').value.toLowerCase();
    if(searchTerm === undefined){
        filteredCoffees = coffees.split();
    }else{
        filteredCoffees = coffees.filter(coffee => coffee.name.toLowerCase().includes(searchTerm));
    }
    if (roastSelect !== "none") {
        filteredCoffees = filteredCoffees.filter(coffee => coffee.roast && coffee.roast.toLowerCase().includes(roastSelect));
    }
    if (locationSelect !== "none") {
        filteredCoffees = filteredCoffees.filter(coffee => coffee.countryLocation && coffee.countryLocation.toLowerCase().includes(locationSelect));
    }
    console.log(filteredCoffees.length); // Outputs the filtered coffees
    injectCoffeeCardsIntoDom();
    // setCardsInPagination();
    // displayPage(1);
    // updatePagination();
    initPagination(); 
};

// const initSearchBar = () => {
//     const searchBar = document.getElementById("search-bar");
//     searchBar.addEventListener("input",searchInputSubmit);
// };

const initFormSubmit = () => {
    const form = document.querySelector('.filter-bar form');
    form.addEventListener('submit', searchInputSubmit);
};
// searching feature ends

// sorting feature starts
const sortCoffees = (method) => {
    console.log("sortCoffees:", method); // TESTING
    if(method === "name: a-z"){
        console.log("sortCoffees:", 1); // TESTING
        filteredCoffees = filteredCoffees.sort((a, b) => a.name.localeCompare(b.name));
    }else if(method === "name: z-a"){
        console.log("sortCoffees:", 2); // TESTING
        filteredCoffees = filteredCoffees.sort((a, b) => b.name.localeCompare(a.name));
    }else if(method === "date: 0-9"){
        console.log("sortCoffees:", 3); // TESTING
        filteredCoffees = filteredCoffees.sort((a, b) => a.reviewDate - b.reviewDate);
    }else{ // method === "date: 9-0"
        console.log("sortCoffees:", 4); // TESTING
        filteredCoffees = filteredCoffees.sort((a, b) => b.reviewDate - a.reviewDate);
    }
};

const initSort = () => {
    const buttons = document.querySelectorAll('.sort-buttons button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            sortCoffees(button.textContent);
            injectCoffeeCardsIntoDom();
            initPagination();
        });
    });
};
// sorting feature ends

document.addEventListener("DOMContentLoaded", async()=>{
    await fetchCoffeeData();
    injectCoffeeCardsIntoDom();
    initPagination();
    // initSearchBar();
    initFormSubmit();
    initSort();
});
