// Wait for the DOM to be fully loaded before running scripts
// This ensures all elements are available for manipulation

document.addEventListener('DOMContentLoaded', () => {
    // Query selectors for navigation and widgets
    const tabContents = document.querySelectorAll('.tab-content');
    const burgerMenu = document.querySelector('.burger-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuButtons = document.querySelectorAll('.menu-content button');
    const flipCard = document.querySelector('.flip-card');

    // ===================== Home Header Mouse-Follow Blur Effect =====================
    const bgImage = document.getElementById('bgImage');
    const homeHeader = document.querySelector('.home-header');
    
    if (bgImage && homeHeader) {
        // Create a radial gradient mask for the spotlight effect
        let spotlightRadius = 150; // Radius of the clear area around mouse
        
        homeHeader.addEventListener('mousemove', (e) => {
            const rect = homeHeader.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create radial gradient for spotlight effect
            const gradient = `radial-gradient(circle ${spotlightRadius}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.8) 70%)`;
            
            // Apply the gradient as a mask to create the spotlight effect
            bgImage.style.mask = gradient;
            bgImage.style.webkitMask = gradient;
            
            // Add spotlight class for additional effects
            bgImage.classList.add('spotlight');
        });
        
        // Remove spotlight effect when mouse leaves the header
        homeHeader.addEventListener('mouseleave', () => {
            bgImage.style.mask = 'none';
            bgImage.style.webkitMask = 'none';
            bgImage.classList.remove('spotlight');
        });
        
        // Adjust spotlight size based on screen size
        function updateSpotlightSize() {
            if (window.innerWidth <= 768) {
                spotlightRadius = 100;
            } else if (window.innerWidth <= 480) {
                spotlightRadius = 80;
            } else {
                spotlightRadius = 150;
            }
        }
        
        // Update spotlight size on window resize
        window.addEventListener('resize', updateSpotlightSize);
        updateSpotlightSize(); // Initial call
    }

    // ===================== Flip Card Functionality =====================
    // Main widget flip (3D flip)
    if (flipCard) {
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('flipped');
        });
    }

    // Simple flip for specific widgets (fade/toggle)
    const divineLoveFlip = document.getElementById('divine-love-flip');
    const compassionFlip = document.getElementById('compassion-flip');
    const gratitudeFlip = document.getElementById('gratitude-flip');
    const presenceFlip = document.getElementById('presence-flip');
    const familyBondsFlip = document.getElementById('family-bonds-flip');
    const placesFlip = document.getElementById('places-flip');
    [divineLoveFlip, compassionFlip, gratitudeFlip, presenceFlip, familyBondsFlip, placesFlip].forEach(flipWidget => {
        if (flipWidget) {
            flipWidget.addEventListener('click', () => {
                flipWidget.classList.toggle('flipped');
            });
        }
    });

    // ===================== Navigation & Menu =====================
    // Function to switch tabs (legacy, not used in scroll-based layout)
    function switchTab(tabId) {
        // Update tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    }

    // Scroll smoothly to a section by ID
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Burger menu open/close logic
    burgerMenu.addEventListener('click', () => {
        burgerMenu.querySelector('.burger').classList.toggle('open');
        menuOverlay.classList.toggle('active');
    });

    // Close menu when clicking outside the menu content
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            burgerMenu.querySelector('.burger').classList.remove('open');
            menuOverlay.classList.remove('active');
        }
    });

    // Menu button click: scroll to section and close menu
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            scrollToSection(sectionId);
            burgerMenu.querySelector('.burger').classList.remove('open');
            menuOverlay.classList.remove('active');
        });
    });

    // ===================== Carousel Logic (Tab 2) =====================
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselWidgets = document.querySelectorAll('.carousel-widget');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    let activeIndex = 0;

    // Update carousel position and active/prev/next classes
    function updateCarousel() {
        carouselWidgets.forEach((widget, idx) => {
            widget.classList.remove('active', 'prev', 'next');
            if (idx === activeIndex) {
                widget.classList.add('active');
            } else if (idx === activeIndex - 1) {
                widget.classList.add('prev');
            } else if (idx === activeIndex + 1) {
                widget.classList.add('next');
            }
        });
        // Center the active card using translateX
        const widgetWidth = carouselWidgets[0].offsetWidth + 48; // width + margin (24px each side)
        const trackOffset = (activeIndex * widgetWidth);
        const container = document.querySelector('.carousel-container');
        const containerWidth = container.offsetWidth;
        const centerOffset = (containerWidth - widgetWidth) / 2;
        carouselTrack.style.transform = `translateX(${-trackOffset + centerOffset}px)`;
    }

    // Carousel arrow event listeners
    if (carouselWidgets.length) {
        updateCarousel();
        if (leftArrow && rightArrow) {
            leftArrow.addEventListener('click', () => {
                activeIndex = (activeIndex - 1 + carouselWidgets.length) % carouselWidgets.length;
                updateCarousel();
            });
            rightArrow.addEventListener('click', () => {
                activeIndex = (activeIndex + 1) % carouselWidgets.length;
                updateCarousel();
            });
        }
        // Recenter carousel on window resize
        window.addEventListener('resize', updateCarousel);
    }

    // ===================== Section Appear Animation =====================
    // Fade/slide in sections as they enter the viewport
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-appear');
            obs.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach(section => observer.observe(section));

    // ===================== Dynamic Body Background =====================
    // Change body background color based on section in view
    const sectionsBg = document.querySelectorAll('.section');
    window.addEventListener('scroll', () => {
      let current = null;
      sectionsBg.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
          current = section;
        }
      });
      if (current) {
        document.body.style.background = current.dataset.bg;
      }
    });
});

// ===================== Global Functions =====================
// Function to scroll to content from home header (called by onclick)
function scrollToContent() {
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
    }
}
