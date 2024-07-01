// bookmark.js

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cardsContainer');

    cardsContainer.addEventListener('click', async (event) => {
        const card = event.target.closest('.card');
        if (!card) return;

        const bookmarkIcon = card.querySelector('.card__icon');
        if (!bookmarkIcon) return;

        const isBookmarked = card.classList.contains('bookmarked');
        const imagenId = card.dataset.imagenId;

        try {
            if (isBookmarked) {
                // Remove bookmark
                await fetch(`/database/removeBookmark/${imagenId}`, { method: 'DELETE' });
                card.classList.remove('bookmarked');
                bookmarkIcon.classList.remove('fa-bookmark-solid');
                bookmarkIcon.classList.add('fa-bookmark');
            } else {
                // Add bookmark
                await fetch(`/database/addBookmark/${imagenId}`, { method: 'POST' });
                card.classList.add('bookmarked');
                bookmarkIcon.classList.remove('fa-bookmark');
                bookmarkIcon.classList.add('fa-bookmark-solid');
            }
        } catch (error) {
            console.error('Error al procesar el bookmark:', error);
            alert('Ocurrió un error al procesar el bookmark. Inténtelo más tarde.');
        }
    });
});

