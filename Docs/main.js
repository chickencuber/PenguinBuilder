$.all(".category").click(function () {
    const id = "#" + $.from(this).text().replaceAll(/[+ \n\t]/g, "");
    const elt = $(id);
    $("#categories").children.removeClass("selected");
    $.from(this).class("selected")
    elt.elt.scrollIntoView({ behavior: 'smooth' });
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
