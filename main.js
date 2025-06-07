class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Load header.html
    const response = await fetch('/components/header.html');
    const text = await response.text();

    // Parse the loaded HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    // Select the template inside loaded HTML
    const template = tempDiv.querySelector('template#header-template');
    if (!template) {
      console.error('Template #header-template not found!');
      return;
    }

    // Clone the template content
    const content = template.content.cloneNode(true);

    // Add stylesheet link to shadow root
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/style.css';  // use root-relative path for consistency

    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(content);

    // Highlight the active nav link
    const currentPage = "/" + window.location.pathname.split('/').slice(1).join('/');
    const navLinks = this.shadowRoot.querySelectorAll('nav a');
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || (currentPage.toLowerCase().includes("states") && linkPage == "/pages/usa.html")) {
        link.classList.add('active');
      }
    });
  }
}

class Footer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Load header.html
    const response = await fetch('/components/footer.html');
    const text = await response.text();

    // Parse HTML into a DOM element
    const template = document.createElement('div');
    template.innerHTML = text;

    // Grab the template content
    const content = template.querySelector('template').content.cloneNode(true);

    // Attach stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/style.css';

    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(content);
  }
}

customElements.define('header-component', Header);
customElements.define('footer-component', Footer);
