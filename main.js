class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const fullPath = window.location.pathname;
    let basePath = "/";
    if (isGitHubPages) {
      const match = fullPath.match(/^\/[^\/]+/);
      basePath = match ? match[0] + '/' : '/';
    }


    const pathDepth = fullPath.split('/').length - 2;
    const relativePath = '../'.repeat(pathDepth > 0 ? pathDepth : 0);
    const stylePath = basePath + 'style.css';
    const componentsPath = basePath + 'components/';

    const response = await fetch(componentsPath + 'header.html');
    const text = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    const template = tempDiv.querySelector('template#header-template');
    if (!template) {
      console.error('Template #header-template not found!');
      return;
    }

    const content = template.content.cloneNode(true);

    // Fix hrefs to be relative to current depth
    // Fix hrefs to include basePath when needed (especially for GitHub Pages)
    const navLinks = content.querySelectorAll('nav a, .site-title a');
    navLinks.forEach(link => {
      const originalHref = link.getAttribute('href');
      if (
        originalHref &&
        !originalHref.startsWith('http') &&
        !originalHref.startsWith('/')
      ) {
        link.setAttribute('href', basePath + originalHref);
      }
    });


    // Add stylesheet to shadow root
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = stylePath;

    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(content);

    // Highlight the active nav link
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const shadowLinks = this.shadowRoot.querySelectorAll('nav a');
    shadowLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.toLowerCase().includes(currentPage)) {
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
    const isGitHubPages = window.location.hostname.includes('github.io');
    const fullPath = window.location.pathname;
    let basePath = "/";
    if (isGitHubPages) {
      const match = fullPath.match(/^\/[^\/]+/);
      basePath = match ? match[0] + '/' : '/';
    }
    const pathDepth = fullPath.split('/').length - 2;
    const relativePath = '../'.repeat(pathDepth > 0 ? pathDepth : 0);
    const stylePath = basePath + 'style.css';
    const componentsPath = basePath + 'components/';

    const response = await fetch(componentsPath + 'footer.html');
    const text = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    const template = tempDiv.querySelector('template#footer-template');
    if (!template) {
      console.error('Template #footer-template not found!');
      return;
    }

    const content = template.content.cloneNode(true);

    // Fix hrefs to be relative to current depth
    const navLinks = content.querySelectorAll('ul li a');
    navLinks.forEach(link => {
      const originalHref = link.getAttribute('href');
      if (
        originalHref &&
        !originalHref.startsWith('http') &&
        !originalHref.startsWith('/')
      ) {
        link.setAttribute('href', basePath + originalHref);
      }
    });

    // Add stylesheet to shadow root
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = stylePath;

    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(content);

    // Highlight the active nav link
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const shadowLinks = this.shadowRoot.querySelectorAll('nav a');
    shadowLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.toLowerCase().includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }
}

customElements.define('header-component', Header);
customElements.define('footer-component', Footer);
