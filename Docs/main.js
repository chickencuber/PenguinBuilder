$.all(".category").click(function () {
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


$("#docs").on("scroll", () => {
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const html = document.documentElement;
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || html.clientHeight) &&
            rect.right <= (window.innerWidth || html.clientWidth)
        );
    }
    for(const elt of $("#doc").children) {
        if(isInViewport(elt.elt)) {
            $("#categories").children.removeClass("selected");
            $("#button-" + elt.id()).class("selected");
            return;
        }
    }
});
