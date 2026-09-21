const projects = [

    {
        name: "Website Portfolio - HTML + CSS",
        desc: "A portfolio to showcase who I am and my personal projects and blogs.",
        image: "./Media/Project1/portfolio.png",
        alt: "Homepage of the website portfolio",
        duration: "20 hours",
        difficulty: "Medium",
        category: "Webdevelopment",
        year: 2026,
        link: "project1.html"
    },

    {
        name: "Valorant Dodge Game - Python",
        desc: "Videogame where the player needs to dodge dropping bombs and try to beat their highscore. Includes an AI-mode you can activate to let the AI do the work for you.",
        image: "./Media/Project2/dodge.png",
        alt: "Valorant Dodge Game home screen showing controls and gamemodes",
        duration: "12 hours",
        difficulty: "Easy",
        category: "Python",
        year: 2026,
        link: ""
    }

];


const projectsContainer = document.querySelector("#projects-container");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortSelect = document.querySelector("#sort-select");


function renderProjects(projectsToShow) {

    projectsContainer.replaceChildren();

    projectsToShow.forEach(project => {

        const card = document.createElement("div");
        card.classList.add("card");


        const image = document.createElement("img");
        image.src = project.image;
        image.alt = project.alt;


        const container = document.createElement("div");
        container.classList.add("container");


        const article = document.createElement("article");

        const title = document.createElement("h2");
        title.textContent = project.name;

        const desc = document.createElement("p");
        desc.textContent = project.desc;

        article.append(title, desc);


        const timeText = document.createElement("div");
        timeText.classList.add("time-text");

        const duration = document.createElement("p");
        duration.textContent = `Time duration: ${project.duration}`;

        const difficulty = document.createElement("p");
        difficulty.textContent = `Difficulty: ${project.difficulty}`;


        const link = document.createElement("a");
        link.href = project.link;
        link.classList.add("explore");
        link.textContent = "Read more..";


        timeText.append(
            duration,
            difficulty,
            link
        );

        container.append(
            article,
            timeText
        );

        card.append(
            image,
            container
        );

        projectsContainer.appendChild(card);
    });
}


function updateProjects() {

    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const sortValue = sortSelect.value;


    let filteredProjects = projects.filter(project => {

        const matchesSearch =
            project.name.toLowerCase().includes(searchValue) ||
            project.desc.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "all" ||
            project.category === categoryValue;

        return matchesSearch && matchesCategory;
    });


    if (sortValue === "name-asc") {

        filteredProjects.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }

    if (sortValue === "name-desc") {

        filteredProjects.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    }

    if (sortValue === "year-new") {

        filteredProjects.sort((a, b) =>
            b.year - a.year
        );

    }

    if (sortValue === "year-old") {

        filteredProjects.sort((a, b) =>
            a.year - b.year
        );

    }


    renderProjects(filteredProjects);
}


searchInput.addEventListener(
    "input",
    updateProjects
);


categoryFilter.addEventListener(
    "change",
    updateProjects
);


sortSelect.addEventListener(
    "change",
    updateProjects
);

updateProjects();
