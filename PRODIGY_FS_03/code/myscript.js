let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  if (index < 0) {
    slideIndex = slides.length - 1;
  } else if (index >= slides.length) {
    slideIndex = 0;
  }
  slides.forEach(slide => slide.style.display = 'none');
  slides[slideIndex].style.display = 'block';

  // Show caption only on the first slide
  const captions = document.querySelectorAll('.slide-caption');
  captions.forEach((caption, i) => {
    if (i === slideIndex) {
      caption.style.display = 'block';
    } else {
      caption.style.display = 'none';
    }
  });
}
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
  }
}
function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}
function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}
showSlide(slideIndex);
setInterval(() => {
  nextSlide();
}, 1500); // 1.5 seconds




//changing images when mouse is over the image
function changeImage(img, newSrc) {
  img.src = newSrc;
}

function restoreImage(img) {
  var originalSrc = img.getAttribute('data-original-src');
  img.src = originalSrc;
}


document.querySelectorAll('.card__inner').forEach(function(cardInner) {
  cardInner.addEventListener('mouseenter', function() {
    cardInner.classList.toggle('is-flipped');
  });
});


document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting
  // Add your form submission logic here
  alert('Contact form submitted!');
});






