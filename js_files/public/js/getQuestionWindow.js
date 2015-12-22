  var childWindow;
  function previewFile(){
     var preview = document.querySelector('img'); //selects the query named img
     var file    = document.querySelector('input[type=file]').files[0]; //sames as here
     var reader  = new FileReader();

     reader.onloadend = function () {
         preview.src = reader.result;
     }

     if (file) {
         reader.readAsDataURL(file); //reads the data as a URL
     } else {
         preview.src = "";
    }
  }

  function openWindow() {
    console.log("WE ARE HERE")
    childWindow = window.open("/survey", "", "top = 200, left = 450, width = 400, height = 400" );
  }


