document.addEventListener('DOMContentLoaded', async () => {
    let allImages = [];
    
    try {
        const response = await fetch('/database/imagenes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allImages = await response.json();
        displayImages(allImages);
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        alert('Ocurrió un error. Inténtelo más tarde.');
    }

    const searchInput = document.querySelector('.search__input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredImages = allImages.filter(imagen => 
            imagen.nombreImagen.toLowerCase().includes(searchTerm) ||
            imagen.nombre.toLowerCase().includes(searchTerm) ||
            imagen.apellidos.toLowerCase().includes(searchTerm) ||
            imagen.correo.toLowerCase().includes(searchTerm)
        );
        displayImages(filteredImages);
    });

    function displayImages(images) {
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        images.forEach(imagen => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card__image-container">
                    <img class="card__image" src="data:image/png;base64,${imagen.imagen}" alt="">
                </div>

                <ul class="card__tags">
                    <li>${imagen.nombre}</li>
                    <li>${imagen.apellidos}</li>
                </ul>
                <h3 class="card__title">${imagen.nombreImagen}</h3>
            `;
            container.appendChild(card);
            card.addEventListener('click', () => openModal(imagen));
        });
    }

    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close');

    function openModal(imagen) {
        modal.style.display = 'block';
        modalImg.src = `data:image/png;base64,${imagen.imagen}`;
        captionText.innerHTML = `${imagen.nombre} ${imagen.apellidos} - ${imagen.nombreImagen}`;
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
