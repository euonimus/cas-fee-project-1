
    // Get the modal
    const popup = document.getElementById("popup");

    // Get the button that opens the modal
    const btnOpenPoup = document.getElementById("btnOpenPopup");

    // Get the <span> element that closes the modal
    const btnCanclePopup = document.getElementById("btnCanclePopup");

    // when user clicks on button btnOpenPopup
    btnOpenPoup.onclick = function() {
        popup.style.display = "block";
    }

    // when user clicks on button btnOpenPopup
    btnCanclePopup.onclick = function() {
        popup.style.display = "none";
    }    

    // When the user clicks outside of the popup
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }