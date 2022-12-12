'use strict';

let radios, radioButtonValue;
let dropButton; 

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function selectType() {
  let radios = document.getElementsByName('postType');
    
  for (let i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      radioButtonValue = radios[i].value;
      if (radioButtonValue == "lainataan") {
        dropButton = document.getElementById("dropButton");
        dropButton.innerHTML = "lainataan";
        dropButton.style.color = "black"
        dropButton.style.backgroundColor = "lightgreen"
      } else if (radioButtonValue == "myydään") {
        dropButton = document.getElementById("dropButton");
        dropButton.innerHTML = "myydään";
        dropButton.style.color = "black"
        dropButton.style.backgroundColor = "yellow"
      } 
    }
  } 
}
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
          
        }
      }
    }
  }

function showPreview(event) {
  if(event.target.files.length > 0) {
    let src = URL.createObjectURL(event.target.files[0]);
    let preview = document.getElementById("imgPreview");;
    preview.src = src;
    preview.style.display = "block";
  }
}