const tabs = document.querySelectorAll('.catalog-tab')
const cardContainers = document.querySelectorAll('.catalog-cards')

for (const tab of tabs) {
    tab.addEventListener('click', () => {
        for (const tab2 of tabs) {
            tab2.classList.remove('active')
        }

        tab.classList.add('active')

        for (const cardContainer of cardContainers) {
            cardContainer.classList.remove('active')
        }

        const target = tab.dataset.target

        const targetEl = document.querySelector(target)

        targetEl.classList.add('active')
    })
}