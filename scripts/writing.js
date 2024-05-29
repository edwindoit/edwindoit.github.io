document.addEventListener('DOMContentLoaded', () => {
    const entries = [
        { title: "First Writing Entry", file: "entry1.md", date: "2024-01-01", id: "firstwritingentry" },
        { title: "How to introduce", file: "Introduction.md", date: "12-10-2022", id: "Introduction" },
        { title: "The KEE system", file: "KEEsystem.md", date: "10-11-2022", id: "Keesystem" },
        { title: "Read better", file: "Bettereader.md", date: "11-13-2022", id: "Betterreader" },
        { title: "Killer apps 2022", file: "Killerapps2022.md", date: "03-09-2022", id: "Killerapps2022" },
        { title: "Killer apps 2024", file: "Killerapps2024.md", date: "27-03-2024", id: "Killerapps2024" },
        { title: "Goalsetting is hard", file: "Goalsettinghard.md", date: "10-11-2022", id: "Goalsettinghard.md" },
        { title: "Problem solving", file: "Problemsolving.md", date: "27-05-2023", id: "Problemsolving" },
        { title: "Quick decisions", file: "Quickcall.md", date: "29-10-2023", id: "Quickcall" },
        { title: "Read it later", file: "Readitlater.md", date: "25-09-2022", id: "Readitlater" }
    ];

    const sidebar = document.getElementById('sidebar');
    const writingSidebar = document.getElementById('writing-sidebar');
    const content = document.getElementById('writing-content');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    let activeEntry = null;

    entries.forEach(entry => {
        const linkWrapper = document.createElement('a');
        linkWrapper.href = `#${entry.id}`;
        linkWrapper.classList.add('entry-wrapper');
        linkWrapper.onclick = (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            loadEntry(entry.file, entry.id);

            // Set active class
            if (activeEntry) {
                activeEntry.classList.remove('active');
            }
            linkWrapper.classList.add('active');
            activeEntry = linkWrapper;

            // Update the URL without reloading the page
            history.pushState(null, '', `#${entry.id}`);

            if (window.innerWidth <= 960) {
                body.classList.add('show-content');
            }
        };

        const title = document.createElement('div');
        title.classList.add('entry-title');
        title.textContent = entry.title;
        linkWrapper.appendChild(title);

        const date = document.createElement('div');
        date.classList.add('entry-date');
        date.textContent = entry.date;
        linkWrapper.appendChild(date);

        writingSidebar.appendChild(linkWrapper);
    });

    function loadEntry(file, id = null) {
        fetch(`content/writing/${file}`)
            .then(response => response.text())
            .then(text => {
                content.innerHTML = marked.parse(text);
                if (id) {
                    setActiveEntryById(id);
                }
            })
            .catch(error => console.error('Error loading the writing entry:', error));
    }

    function setActiveEntryById(id) {
        entries.forEach(entry => {
            if (entry.id === id) {
                const link = document.querySelector(`a[href="#${id}"]`);
                if (link) {
                    if (activeEntry) {
                        activeEntry.classList.remove('active');
                    }
                    link.classList.add('active');
                    activeEntry = link;
                }
            }
        });
    }

    // Optionally, load the first entry by default if no hash is present
    if (window.location.hash) {
        const entryId = window.location.hash.substring(1);
        const entry = entries.find(e => e.id === entryId);
        if (entry) {
            loadEntry(entry.file, entry.id);
            if (window.innerWidth <= 960) {
                body.classList.add('show-content');
            }
        }
    } else if (entries.length > 0) {
        loadEntry(entries[0].file, entries[0].id);
    }

    // Handle window resize to show/hide sidebars
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Add event listener for the menu toggle button
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open'); // Toggle the open class on the sidebar
    });

    // Set active menu item for main navigation
    setActiveMenuItem();

    function setActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index';
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            const link = item.getAttribute('href').replace('.html', '');
            if (link && link === currentPage) {
                item.classList.add('active');
            }
        });
    }
});

function handleResize() {
    // No-op function to prevent errors
}