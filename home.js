// ------------------------------
// Language selection

let language = 'EN'

const lang_button = document.getElementById("lang-select");
lang_button.addEventListener("click", function() {
    if (language === 'EN') {
        language = 'ES';
        lang_button.textContent = 'ES';
    } else {
        language = 'EN';
        lang_button.textContent = 'EN';
    }

});

// ------------------------------
// Dark mode and light mode
const dark_mode_button = document.getElementById("dark-mode");
const light_mode_button = document.getElementById("light-mode");

dark_mode_button.addEventListener("click", function() {
    dark_mode_button.parentNode.style.display = 'none';
    light_mode_button.parentNode.style.display = 'flex';
});
light_mode_button.addEventListener("click", function() {
    dark_mode_button.parentNode.style.display = 'flex';
    light_mode_button.parentNode.style.display = 'none';
});