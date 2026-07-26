let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for(let info of taxInfo) {
        info.style.display = taxSwitch.checked ? "inline" : "none";
    }
})