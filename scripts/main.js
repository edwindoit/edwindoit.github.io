document.addEventListener('DOMContentLoaded', () => {
    // Load sidebar content
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('.container').insertAdjacentHTML('afterbegin', data);
            addMenuToggleFunctionality(); // Call the function to add toggle functionality
            setActiveMenuItem(); // Set active menu item after loading sidebar
        });

    // Load page content
    const contentElement = document.getElementById('content');
    const page = window.location.pathname.split('/').pop() || 'index';
    const mdFile = page === 'index' ? 'home.md' : `${page}.md`;

    fetch(`content/${mdFile}`)
        .then(response => response.text())
        .then(text => {
            contentElement.innerHTML = marked.parse(text);
        });

    // Handle window resize to show/hide sidebars
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
});

function addMenuToggleFunctionality() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

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