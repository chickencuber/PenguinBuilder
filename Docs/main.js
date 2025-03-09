let dark = false;
class Rect extends JSQuery.Plugin {
    Element() {
        return {
            rect() {
                return this.elt.getBoundingClientRect();
            }
        }
    }
}

$.loadPlugin(Rect, true);

Number.prototype.within = function (min, max) {
    return this >= min && this <= max;
}

let scrolling = false;

$.all(".category").click(function () {
    scrolling = true;
    const end = () => {
        scrolling = false;
        $("#docs").removeEvent(
            "scrollend",
            end,
            { once: true }
        );
    };
    $("#docs").on(
        "scrollend",
        end,
        { once: true }
    );

    const id = "#" + $.from(this).id().slice(7);
    const elt = $(id);
    elt.elt.scrollIntoView({ behavior: 'smooth' });
    $("#categories").children.removeClass("selected");
    $.from(this).class("selected");
    setUrl(location.href.slice(0, -location.hash.length) + id); 
});

(async () => {
    const markdownContent = {};
    for (const f of ["Block",
        "Category",
        "Utils",
        "Extra_Functions",
        "Alert",
        "Eval",
        "JSON",
        "Variables",
        "creatingextensions",
        "postingextensions"]) {
        const contents = await fetch("./" + f + ".md?cache=" + Date.now());
        markdownContent[f] = await contents.text();
    }
    const md = markdownit()

    for (const [sectionId, markdown] of Object.entries(markdownContent)) {
        const sectionDiv = $(`#${sectionId}`);
        if (sectionDiv) {
            const htmlContent = md.render(markdown);
            sectionDiv.html(htmlContent);
        }
    }

    setTimeout(() => {
        const h = $("#button-" + location.hash.slice(1));
        if(h) {
            h.click();
        } else {
            setUrl(location.href.slice(0, -location.hash.length) + "#Block"); 
        }
        if (dark) $.all("*:not(.dark)").forEach(v => v.class("dark"));
    }, 200)
})()

let last = $("#docs").elt.scrollTop;

function setUrl(url) {
    history.replaceState(null, "", url);
}

$("#docs").on("scroll", (e) => {
    if (scrolling) return;
    const scroll = e.target.scrollTop;
    for (const v of $("#docs").children) {
        const rect = v.rect();
        if ((scroll < last ? rect.bottom : rect.top).within(0, innerHeight)) {
            $("#categories").children.removeClass("selected");
            $(`#button-${v.id()}`).class("selected")
            setUrl(location.href.slice(0, -location.hash.length) + "#" + v.id());
            break;
        }
    }
    last = scroll;
});

if (localStorage.getItem("PenguinBuilder") === null) {
    localStorage.setItem("PenguinBuilder", JSON.stringify({
        shown_version: "0",
        dark: false,
    }))
}

if(JSON.parse(localStorage.getItem("PenguinBuilder")).dark) {
    dark = true;
    $.all("*").forEach(v => v.class("dark"));
}

