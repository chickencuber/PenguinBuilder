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

Number.prototype.within = function (least, most) {
    return this >= least && this <= most
}

let scrolling = false;

$.all(".category").click(function () {
    scrolling = true;
    const end = (e) => {
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

    const id = "#" + $.from(this).text().replaceAll(/[+ \n\t]/g, "");
    const elt = $(id);
    elt.elt.scrollIntoView({ behavior: 'smooth' });
    $("#categories").children.removeClass("selected");
    $.from(this).class("selected");
});

(async () => {
    const markdownContent = {};
    for (const f of ["Block",
        "Utils",
        "Alert",
        "Eval",
        "JSON",
        "Variables",
        "Extensions",
        "creatingextensions",
        "postingextensions"]) {
        const contents = await fetch("./" + f + ".md");
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

})()

$("#docs").on("scroll", (e) => {
    if (scrolling) return;
    const scroll = e.target.scrollTop;
    for(const v of $("#docs").children) {
        const rect = v.rect();
        console.log(rect.top)
        if(scroll.within(rect.top - rect.height, rect.top)) {
            $("#categories").children.removeClass("selected");
            $(`#button-${v.id()}`).class("selected");
            //return;
        }
    }
});
