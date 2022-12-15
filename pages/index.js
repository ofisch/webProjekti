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

function openMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('#listingUser')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }