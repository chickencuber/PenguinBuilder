$.all(".category").click(function () {
    const id = "#" + $.from(this).text().replaceAll(/[+ \n\t]/g, "");
    const elt = $(id);
    $("#categories").children.removeClass("selected");
    $.from(this).class("selected")
    elt.elt.scrollIntoView({ behavior: 'smooth' });
});

$.doc().on("scroll", () => {
    const categoryPositions = $("#docs").children.map(section => {
        const rect = section.elt.getBoundingClientRect();
        return { id: "button-" + section.id(), top: rect.top, bottom: rect.bottom };
    });

    const activeCategory = categoryPositions.find(category => category.top <= 0 && category.bottom > 0);

    $("#categories").children.removeClass("selected");

    if (activeCategory) {
        const activeButton = $(`.category[data-section-id="${activeCategory.id}"]`);
        if (activeButton) {
            activeButton.class("selected");
        }
    }
})

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
        const converter = new showdown.Converter();

        for (const [sectionId, markdown] of Object.entries(markdownContent)) {
            const sectionDiv = $(`#${sectionId}`);
            if (sectionDiv) {
                const htmlContent = converter.makeHtml(markdown);
                sectionDiv.html(htmlContent);
            }
        }

    })()
