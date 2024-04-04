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
    const categories = $.all(".category");
    const docSections = $("#docs").children;
    const scrollTop = $("#docs").elt.scrollTop;

    // Iterate over each section and find the one currently in view
    for (let i = 0; i < docSections.length; i++) {
        const section = docSections[i];
        const rect = section.elt.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        if (sectionTop <= 0 && sectionBottom >= 0) {
            // This section is currently in view
            const sectionId = section.id();
            const category = categories.find(cat => cat.text() === sectionId);
            if (category) {
                // Remove selected class from all categories
                categories.removeClass("selected");
                // Add selected class to the corresponding category
                category.class("selected");
            }
            break; // Exit loop once we find the visible section
        }
    }
});
