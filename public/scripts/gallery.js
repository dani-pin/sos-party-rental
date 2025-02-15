const tabs = document.querySelectorAll(".gallery-tab")
const eventImageContainers = document.querySelectorAll(".gallery-images")

for (const tab of tabs) {
    tab.addEventListener("click", () => {
        selectTab(tab.dataset.target)
    })
}

if (window.location.hash === "#special-occasions") {
    selectTab("#special-occasion-gallery-imgs")
} else if (window.location.hash === "#corporate-events") {
    selectTab("#corporate-events-gallery-imgs")
}


function selectTab(dataTarget) {
    for (const tab of tabs) {
        tab.classList.remove("active")
    }

    const tab = document.querySelector(`.gallery-tab[data-target="${dataTarget}"]`)
    tab.classList.add("active")

    for (const eventImageContainer of eventImageContainers) {
        eventImageContainer.classList.remove("active")
    }

    const target = tab.dataset.target

    const targetEl = document.querySelector(target)

    targetEl.classList.add("active")
}