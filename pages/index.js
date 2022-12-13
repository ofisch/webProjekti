'use strict';

let listingContainer;
let listing;

const data = sessionStorage.getItem('data');

listing = document.getElementsByClassName("listing");

console.log(listing.length);

window.onload = function () {
    
    listingContainer = document.getElementById("listings");
    const par = document.createElement("p");
    //par.innerText = "Tässä paragraph";
    document.body.appendChild(par);
    listingContainer.appendChild(par);

    console.log(data);
    // Listaus-divin rakentaminen
    const listingBox = document.createElement("div");
    listingBox.classList.add("listing");

    const header = document.createElement("h3");
    header.innerHTML = "otsikkoKannasta";

    const imgBox = document.createElement("div");

    const img = document.createElement("img");
    img.src = "kuvaKannasta";
    img.alt = "kuvausKannasta";
    img.classList.add("listingImage");
    imgBox.appendChild(img);

}



/*
for (let listing of data) {
    listingContainer
.innerHTML = '';

    const img = document.createElement('img');
    img.src = url + '/uploads/' + listing.kuva;
    img.alt = listing.kuvaus;

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.innerHTML = cat.name;

    const p1 = document.createElement('p');
    p1.innerHTML = `Birthdate: ${cat.birthdate}`;

    const p2 = document.createElement('p');
    p2.innerHTML = `Weight: ${cat.weight}kg`;

    const p3 = document.createElement('p');
    p3.innerHTML = `Owner: ${cat.ownername}`;

    const li = document.createElement('li');
    li.classList.add('light-border');
}
*/