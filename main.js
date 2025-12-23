const carrusel = document.querySelector('#carouselExampleAutoplaying')

carrusel.addEventListener('slide.bs.carousel', function (event) {
  const allReadMore = document.querySelectorAll('.readMore');
  allReadMore.forEach((element, index) => {
    if (index === event.to) {
      element.classList.add('active');
      return;
    }
    element.classList.remove('active');
  });
});
