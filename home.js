function mobileOrTablet() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
let mobile = mobileOrTablet();

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
let displaceY = 38;
const nav_ul = document.getElementById("navbar").firstElementChild;
if (!mobile) {
    nav_ul.addEventListener("pointerover", () => nav_ul.style.transform = "translateY(0)");
    nav_ul.addEventListener("pointerout", () => nav_ul.style.transform = "translateY(-" + displaceY  +"px)");
} else {
    nav_ul.addEventListener("pointerdown", (ev) => {
        nav_ul.style.transform = "translateY(0)"
        ev.stopPropagation();  // So that the document event below does not fire
    });
    document.addEventListener("pointerdown", () => nav_ul.style.transform = "translateY(-" + displaceY  +"px)")
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
