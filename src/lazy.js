const isView = (entry) => {
    return entry.isIntersecting
};

const loadImage = (entry) => {

    const imagen = entry.target;
    // console.log(imagen);
    // const imagen = container.firstChild;
    const url = imagen.dataset.src;
    // console.log(url)
    imagen.src = url;

    observer.unobserve(imagen);
};

const observer = new IntersectionObserver((entries) => {

    entries.filter(isView).forEach(loadImage);
})

const registerImage = (imagen) => {
    observer.observe(imagen)
}