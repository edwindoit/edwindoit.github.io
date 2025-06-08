// Function to fetch book cover from Google Books API
async function fetchBookCover(title, author, isbn = null) {
    try {
        let coverUrl = null;
        
        // Strategy 1: Use ISBN if provided (most reliable)
        if (isbn) {
            coverUrl = await searchByISBN(isbn);
            if (coverUrl) return coverUrl;
        }
        
        // Strategy 2: Exact title and author match
        coverUrl = await searchByTitleAuthor(title, author, true);
        if (coverUrl) return coverUrl;
        
        // Strategy 3: Relaxed title and author search
        coverUrl = await searchByTitleAuthor(title, author, false);
        if (coverUrl) return coverUrl;
        
        // Strategy 4: Title only search
        coverUrl = await searchByTitle(title);
        if (coverUrl) return coverUrl;
        
        return null;
    } catch (error) {
        console.error('Error fetching book cover:', error);
        return null;
    }
}

// Search by ISBN (most reliable)
async function searchByISBN(isbn) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&langRestrict=en`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
            const imageLinks = data.items[0].volumeInfo.imageLinks;
            return imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
        }
        return null;
    } catch (error) {
        console.error('ISBN search failed:', error);
        return null;
    }
}

// Search by exact title and author
async function searchByTitleAuthor(title, author, exact = true) {
    try {
        let query;
        if (exact) {
            query = `intitle:"${title}"+inauthor:"${author}"`;
        } else {
            query = `${title}+${author}`;
        }
        
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=en&printType=books&maxResults=5`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
            // Look for the best match
            for (const item of data.items) {
                const bookTitle = item.volumeInfo.title?.toLowerCase() || '';
                const bookAuthors = item.volumeInfo.authors?.join(' ').toLowerCase() || '';
                
                // Check if this is a good match
                if (bookTitle.includes(title.toLowerCase()) && 
                    bookAuthors.includes(author.toLowerCase()) &&
                    item.volumeInfo.imageLinks) {
                    
                    const imageLinks = item.volumeInfo.imageLinks;
                    return imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Title/Author search failed:', error);
        return null;
    }
}

// Search by title only (least reliable, last resort)
async function searchByTitle(title) {
    try {
        const query = `intitle:"${title}"`;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=en&printType=books&maxResults=3`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
            const imageLinks = data.items[0].volumeInfo.imageLinks;
            return imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
        }
        return null;
    } catch (error) {
        console.error('Title search failed:', error);
        return null;
    }
}

// Function to initialize book covers
async function initializeBookCovers() {
    const bookCards = document.querySelectorAll('.book-card');
    
    for (const card of bookCards) {
        const title = card.querySelector('.book-title').textContent;
        const img = card.querySelector('.book-cover');
        const originalSrc = img.src; // Store original image as fallback
        
        // Add loading state
        img.style.opacity = '0.5';
        
        // Get author and ISBN from data attributes
        const author = card.dataset.author;
        const isbn = card.dataset.isbn;
        
        const coverUrl = await fetchBookCover(title, author, isbn);
        
        if (coverUrl) {
            img.src = coverUrl;
            img.style.opacity = '1';
        } else {
            // If no cover found, keep original image
            img.src = originalSrc;
            img.style.opacity = '1';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBookCovers); 