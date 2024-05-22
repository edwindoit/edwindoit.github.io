function onPageLoad() {
    const header = document.querySelector('.notion-header');
    const html = document.querySelector('html');
 
    
    const footerCover = () => {
      const footerCoverNode = document.querySelector('.footer-cover');
      if(footerCoverNode){
        footerCoverNode.remove();
      }
      const cover = document.querySelector('.notion-header__cover');
      const clone = cover.cloneNode(true);
      clone.classList.add('footer-cover');
      clone.classList.remove('notion-header__cover', 'has-cover');
      const content = document.querySelector('.super-content');
     
     content.appendChild(clone);
    }
    footerCover();
    
    const setTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      html.className = '';
      html.classList.add(savedTheme);
    }


    const config = { subtree: true, characterData: true };

    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                footerCover();
                setTheme();
                toggleTheme();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(header, config);
}

document.addEventListener("DOMContentLoaded", onPageLoad);