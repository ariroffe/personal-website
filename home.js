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


// ------------------------------
// Nav navigation

// ul translateY
let displaceY = 39;
let overNav = false;
const nav_ul = document.getElementById("navbar").firstElementChild;
nav_ul.addEventListener("pointerover", () => {
    overNav = true;
    nav_ul.style.transform = "translateY(0)";
})
nav_ul.addEventListener("pointerout", () => {
    overNav = false;
    nav_ul.style.transform = "translateY(-" + displaceY  +"px)";
})

// Link click
const links = Array.from(document.getElementsByClassName("nav-link"));

let sections = [];
let section_ids = [];   // for the next bit. Do it dinamically so we don't have to change this if we add sections...
links.forEach((link) => {
    link.addEventListener("click", function(ev) {
        // Cancel the other links active status
        links.forEach((other_link) => other_link.classList.remove("active"));

        // Give it to this one
        link.classList.add("active");
        displaceY = links.indexOf(link) * 39;  // do not move the ul just yet, set the displace for when the user mouseouts
    })

    // Fill the section and section_id arrays
    if (link.classList.contains("section-link")) {  // for the Game link there is no corresponding section
        const section_id = link.attributes.href.nodeValue;
        section_ids.push(section_id);
        sections.push(document.querySelector(section_id));
    }
})

// When the user scrolls to a section, change the link in the navbar
let offsets = sections.map((section) => section.offsetTop);

function get_current_offset() {
    if (window.scrollY <= offsets[0]) {  // You're before the first offset (before the intro section)
        return offsets[0]
    } else if (window.scrollY >= offsets[offsets.length-1]) {  // You're past the last offset (after last section)
        return offsets[offsets.length-1]
    } else {
        // Otherwise, return at the first offset that is lower or equal to the next offset
        return offsets.find((offset, index) => window.scrollY <= offsets[index + 1])
    }
}
function get_current_section_id() {
    return section_ids[offsets.indexOf(get_current_offset())];
}

let prev_section = "#intro";

// The following is not very efficient, but since the sections can expand and contract other approaches were way more complicated
function setActiveLink() {
    // Recalculate the offsets
    offsets = sections.map((section) => section.offsetTop);
    let current_section = get_current_section_id();
    if (prev_section !== current_section) {
        const new_active_link_index = section_ids.indexOf(current_section);

        links.forEach((other_link) => other_link.classList.remove("active"));  // Clear all links active status
        // The +1 in the next two lines is bc links includes the Game link
        links[new_active_link_index + 1].classList.add("active");  // Set the new link as the active one
        displaceY = (new_active_link_index + 1) * 39;  // Correct the global var so that if you enter and leave menu, it stays where it must
        if (!overNav) nav_ul.style.transform = "translateY(-" +  displaceY  +"px)";  // Move the navbar up
        prev_section = current_section;
    }
}
setActiveLink();  // Run once at the site entering (in case you press back, for example, and are initially not at the top)
window.addEventListener("scroll", setActiveLink);
