// Page navigation functionality with card stacking
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

// Add click listeners to navbar links
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    // Remove active class from all links
    navLinks.forEach((item) => item.classList.remove('active'));
    
    // Add active class to clicked link
    e.target.classList.add('active');
    
    // Hide all pages
    pages.forEach((page) => page.classList.remove('active'));
    
    // Show the corresponding page with card animation
    const pageName = e.target.textContent.toLowerCase();
    const activePage = document.querySelector(`[data-page="${pageName}"]`);
    if (activePage) {
      // Trigger reflow to ensure animation plays
      activePage.offsetHeight;
      activePage.classList.add('active');
    }
  });
});

// Sidebar toggle functionality
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
const sidebar = document.querySelector('[data-sidebar]');
const sidebarInfo = document.querySelector('.sidebar-info_more');

if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    sidebarBtn.classList.toggle('active');
    sidebarInfo.classList.toggle('active');
  });
}

// Smooth scrolling for contact links
const contactLinks = document.querySelectorAll('.contact-link');
contactLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    // Let the default action happen for email/phone/external links
    // This is handled by href attribute
  });
});

// Form submission handling (if needed)
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    // The form will submit to Formspree via the action attribute
    // No additional handling needed unless custom behavior is required
  });
}

// Certificate modal functionality
const modal = document.getElementById('certificationModal');
const modalImage = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Add click listeners to all certification images
const certImages = document.querySelectorAll('.certifications .cert-image');
certImages.forEach((img) => {
  img.addEventListener('click', (e) => {
    const imgSrc = img.src;
    modalImage.src = imgSrc;
    modal.classList.add('active');
  });
});

// Close modal functions
const closeModal = () => {
  modal.classList.remove('active');
};

closeModalBtn.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Project and Certification item expand/collapse functionality
const projectItems = document.querySelectorAll('.projects-list .project-item, .certifications .project-item');
projectItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    // If clicking a link or image, don't expand
    if (e.target.tagName === 'A' || e.target.tagName === 'IMG') {
      return;
    }
    
    // Toggle expanded class
    const isExpanded = item.classList.contains('expanded');
    
    // Find the parent list (projects-list or certifications section)
    const parentList = item.closest('.projects-list') || item.closest('.certifications');
    
    // Close all other expanded items in the same section
    const itemsInSection = parentList ? parentList.querySelectorAll('.project-item') : [];
    itemsInSection.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains('expanded')) {
        otherItem.classList.remove('expanded');
      }
    });
    
    // Toggle current item
    if (!isExpanded) {
      item.classList.add('expanded');
      if (parentList) {
        parentList.classList.add('has-expanded');
      }
    } else {
      item.classList.remove('expanded');
      // Remove has-expanded if no items are expanded in this section
      if (parentList) {
        const hasExpanded = parentList.querySelector('.project-item.expanded');
        if (!hasExpanded) {
          parentList.classList.remove('has-expanded');
        }
      }
    }
  });
});
