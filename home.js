// Check if the user is using a mobile phone (pointerover events and such are different later on)
function mobileOrTablet() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
let mobile = mobileOrTablet();


// ------------------------------
// Language selection

let currentLanguage;
currentLanguage = localStorage.getItem('lang');
if (currentLanguage === null) currentLanguage = 'EN';  // If no preference has been set before, default to english

const lang_button = document.getElementById("lang-select");

// Show the lang selector (will not be shown if user has js disabled)
lang_button.parentNode.style.display = 'flex';

const translatable_elements = Array.from(document.getElementsByClassName('translatable'));

function setSpanish() {
    currentLanguage = 'ES';
    lang_button.textContent = 'ES';
    localStorage.setItem('lang', 'ES')
    translatable_elements.forEach(elem => {
        // Set the english translation in the data-EN attribute in case the user wants to go back
        if (!elem.hasAttribute("data-EN")) elem.setAttribute('data-EN', elem.textContent);
        elem.textContent = elem.getAttribute("data-ES");
    });
}
function setEnglish() {
    currentLanguage = 'EN';
    lang_button.textContent = 'EN';
    localStorage.setItem('lang', 'EN')
    translatable_elements.forEach(elem => elem.textContent = elem.getAttribute("data-EN"));
}
function setLanguage(targetLanguage) {
    if (targetLanguage === 'EN') {
        setEnglish();
    } else if (targetLanguage === 'ES') {
        setSpanish();
    }
}

if (currentLanguage === 'ES') setLanguage('ES');  // Run once at site init if the user prefers spanish
lang_button.addEventListener("click", function(ev) {
    ev.preventDefault();
    if (currentLanguage === 'EN') {
        setLanguage('ES');
    } else if (currentLanguage === 'ES') {
        setLanguage('EN');
    }
});


// ------------------------------
// Dark mode and light mode

const dark_mode_button = document.getElementById("dark-mode");
const light_mode_button = document.getElementById("light-mode");

let preferredTheme = localStorage.getItem('theme');

function setLightMode() {
    dark_mode_button.parentNode.style.display = 'none';
    light_mode_button.parentNode.style.display = 'flex';
    document.documentElement.setAttribute('data-theme', 'light');
}
function setDarkMode() {
    dark_mode_button.parentNode.style.display = 'flex';
    light_mode_button.parentNode.style.display = 'none';
    document.documentElement.setAttribute('data-theme', 'dark');
}

dark_mode_button.addEventListener("click", function(ev) {
    ev.preventDefault();
    setLightMode();
    localStorage.setItem('theme', 'light');  // Remember for your next visit
});
light_mode_button.addEventListener("click", function(ev) {
    ev.preventDefault();
    setDarkMode();
    localStorage.setItem('theme', 'dark');  // Remember for your next visit
});

// At site init check if the local storage variable is set (if not, it will be null)
if (preferredTheme === 'light') {
    setLightMode();
} else if (preferredTheme === 'dark') {
    setDarkMode();
// If local storage is not set, but the user has system-wide preferences
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    setLightMode();
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setDarkMode();
// If none of the above, default to light mode
} else{
    setLightMode();
}

// ------------------------------
// Nav navigation

// ul translateY
let displaceY = 38;
const nav_ul = document.getElementById("navbar").firstElementChild;
if (!mobile) {
    nav_ul.addEventListener("pointerover", () => nav_ul.style.transform = "translateY(0)");
    nav_ul.addEventListener("pointerout", () => nav_ul.style.transform = "translateY(-" + displaceY  +"px)");
} else {
    nav_ul.addEventListener("pointerdown", (ev) => {
        nav_ul.style.transform = "translateY(0)";
        nav_ul.parentNode.style.maxHeight = '100%';
        ev.stopPropagation();  // So that the document event below does not fire
    });
    document.addEventListener("pointerdown", () => {
        nav_ul.style.transform = "translateY(-" + displaceY  +"px)";
        nav_ul.parentNode.style.maxHeight = '50px';
    });
}

// Link click
const links = Array.from(document.getElementsByClassName("nav-link"));

let sections = [];
let section_ids = [];   // for the next bit. Do it dinamically so we don't have to change this if we add sections...
links.forEach((link) => {
    link.addEventListener("click", function(ev) {
        // Prevent link clicking if the menu is not expanded (useful for mobile)
        if (mobile && nav_ul.parentNode.offsetHeight <= 60) {
            ev.preventDefault();
            return false
        }

        // Cancel the other links active status
        links.forEach((other_link) => other_link.classList.remove("active"));

        // Give it to this one
        link.classList.add("active");
        displaceY = links.indexOf(link) * 38;  // do not move the ul just yet, set the displace for when the user mouseouts
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

let prev_section = "#";  // So that at first initialization of site it always hits the conditional

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
        displaceY = (new_active_link_index + 1) * 38;  // Correct the global var so that if you enter and leave menu, it stays where it must
        if (nav_ul.parentNode.offsetHeight <= 60)  nav_ul.style.transform = "translateY(-" +  displaceY  +"px)";  // Move the navbar up only if not expanded
        prev_section = current_section;
    }
}
setActiveLink();  // Run once at the site entering (in case you press back, for example, and are initially not at the top)
window.addEventListener("scroll", setActiveLink);


// ------------------------------
// Sections

const expandables = Array.from(document.getElementsByClassName("expandable-list"))

expandables.forEach(function (expandable_ul) {
    // If more than 5 children
    if (expandable_ul.children.length > 5) {
        // Show the "see more" button/link
        const seemore_link = document.getElementById(expandable_ul.id + "-seemore");
        seemore_link.style.display = 'block'

        // Initially hide the elements beyond the fifth
        const children = Array.from(expandable_ul.children);
        children.slice(5).forEach((line) => line.style.display = 'none');

        // Binding for the "see more" button/link
        seemore_link.addEventListener("click", () => {
            // Get an array of the not yet shown child elements
            const not_shown_lines = children.filter(line => line.style.display === 'none');

            if (not_shown_lines.length <= 5) {
                // If there are 5 or less not shown items, show all and hide the "see more" link
                not_shown_lines.forEach(line => line.style.display = 'list-item');
                seemore_link.style.display = 'none';
            } else {
                // If there are more than 5, show the first five
                not_shown_lines.slice(0, 5).forEach(line => line.style.display = 'list-item');
            }
        })
    }
})
