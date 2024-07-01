document.addEventListener('DOMContentLoaded', async () => {
    let allUserImages = [];
    try {
        await loadUserImages(); // Cargar imágenes del usuario al cargar la página

        const uploadForm = document.getElementById('uploadForm');
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const formData = new FormData();
            formData.append('imagen', fileInput.files[0]);
    
            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error('Error al subir la imagen');
                }
    
                alert('Imagen subida correctamente');
                await loadUserImages(); // Actualizar las imágenes después de subir una nueva
            } catch (error) {
                console.error('Error al subir la imagen:', error);
                alert('Ocurrió un error al subir la imagen. Inténtelo más tarde.');
            }
        });

        const searchInput = document.querySelector('.search__input');
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredUserImages = allUserImages.filter(imagen => 
                imagen.nombreImagen.toLowerCase().includes(searchTerm) ||
                imagen.nombre.toLowerCase().includes(searchTerm) ||
                imagen.apellidos.toLowerCase().includes(searchTerm) ||
                imagen.correo.toLowerCase().includes(searchTerm)
            );
            displayUserImages(filteredUserImages);
        });

    } catch (error) {
        console.error('Error al cargar las imágenes del usuario:', error);
        alert('Ocurrió un error. Inténtelo más tarde.');
    }

    async function loadUserImages() {
        const response = await fetch(`/database/imagenes/${usuarioCorreo}`);
        if (!response.ok) {
            throw new Error('Error al cargar las imágenes del usuario');
        }
        allUserImages = await response.json();
        displayUserImages(allUserImages);
    }

    function displayUserImages(images) {
        const container = document.getElementById('userCardsContainer');
        container.innerHTML = '';
        images.forEach(imagen => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img class="card__image" src="data:image/png;base64,${imagen.imagen}" alt="">
                <i class="card__icon fa-regular fa-bookmark"></i>
                <ul class="card__tags">
                    <li>${imagen.nombre}</li>
                    <li>${imagen.apellidos}</li>
                </ul>
                <h3 class="card__title">${imagen.nombreImagen}</h3>
            `;
            container.appendChild(card);
        });
    }

});
