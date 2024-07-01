document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    let index = 0;

    setInterval(() => {
        index = (index + 1) % 3;
        slides.style.transform = `translateX(${-index * 100 / 3}%)`;
    }, 3000);
});
