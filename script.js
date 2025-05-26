"use strict";

let currentSlide = 0;

// DOM references
const appListElement = document.getElementById("appList");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll("[data-category]");
const detailsElement = document.getElementById("appDetails");

// Fetch APK data
const fetchAPKData = async () => {
  try {
    const res = await fetch("data/apks.json");
    const { apps = [] } = await res.json();
    return apps;
  } catch (err) {
    console.error("❌ Failed to fetch APK data:", err);
    return [];
  }
};

// Render app cards
const renderAppList = async (apps = null) => {
  const data = apps || await fetchAPKData();
  if (!appListElement || !data.length) return;

  appListElement.innerHTML = data.map(app => `
    <div class="app-card" data-slug="${app.slug}">
      <img src="${app.icon}" alt="${app.name}" class="app-icon" />
      <div class="app-info">
        <h3 class="app-title">${app.name}</h3>
        <div class="app-meta">
          <span>${app.version}</span>
          <span>${app.size}</span>
        </div>
        <a href="details.html?slug=${app.slug}" class="download-btn">View Details</a>
      </div>
    </div>
  `).join('');
};

// Search apps
const searchApps = async () => {
  const query = searchInput?.value.trim().toLowerCase();
  if (!query) return renderAppList();

  const apps = await fetchAPKData();
  const filtered = apps.filter(app =>
    [app.name, app.description, app.category].some(field =>
      field.toLowerCase().includes(query))
  );
  renderAppList(filtered);
};

// Category filters
const setupCategoryFilters = () => {
  categoryButtons.forEach(button => {
    button.addEventListener("click", async () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;
      const apps = await fetchAPKData();
      const filtered = category === "all" ? apps : apps.filter(app => app.category === category);
      renderAppList(filtered);
    });
  });
};

// Load App Details
const loadAppDetails = async () => {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) return (location.href = "index.html");

  const apps = await fetchAPKData();
  const app = apps.find(a => a.slug === slug);
  if (!app) return (location.href = "index.html");

  // ✅ SEO Tags (safe replace if exists)
  document.title = `${app.name} APK Download - PicAPK`;

  const existingMeta = document.querySelector("meta[name='description']");
  if (existingMeta) existingMeta.remove();
  const metaDesc = document.createElement("meta");
  metaDesc.name = "description";
  metaDesc.content = `Download ${app.name} v${app.version} (${app.size}) APK for Android. ${app.description.slice(0, 140)}...`;
  document.head.appendChild(metaDesc);

  const existingCanonical = document.querySelector("link[rel='canonical']");
  if (existingCanonical) existingCanonical.remove();
  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = `https://yourdomain.netlify.app/details.html?slug=${app.slug}`;
  document.head.appendChild(canonical);

  // Render content
  if (!detailsElement) return;

  const screenshotsHTML = (app.screenshots || []).length > 0 ? `
    <div class="screenshots">
      <h2>Screenshots</h2>
      <div class="screenshot-slider">
        <button class="arrow left" onclick="slideLeft()">←</button>
        <div class="screenshot-container" id="screenshotContainer">
          ${app.screenshots.map(img => `<img src="${img}" class="screenshot-slide" alt="Screenshot"/>`).join("")}
        </div>
        <button class="arrow right" onclick="slideRight()">→</button>
      </div>
    </div>
  ` : "";

  detailsElement.innerHTML = `
    <div class="detail-header">
      <img src="${app.icon}" alt="${app.name}" class="detail-icon" />
      <div>
        <h1 class="detail-title">${app.name}</h1>
        <div class="detail-meta">
          <span>Version: ${app.version}</span> • 
          <span>Size: ${app.size}</span> • 
          <span>Downloads: ${app.downloads}</span> • 
          <span>Rating: ${app.rating}/5</span>
        </div>
        <p>${app.description}</p>
        <a href="${app.apk_file}" class="detail-download" download>Download APK</a>
      </div>
    </div>
    ${screenshotsHTML}
    <div class="description">
      <h2>Description</h2>
      <p>${app.description}</p>
    </div>
  `;
};

// Screenshot sliding
const slideLeft = () => {
  const container = document.getElementById("screenshotContainer");
  if (!container) return;
  const slideWidth = container.offsetWidth / 3;
  if (currentSlide > 0) {
    currentSlide--;
    container.scrollTo({ left: currentSlide * slideWidth, behavior: "smooth" });
  }
};

const slideRight = () => {
  const container = document.getElementById("screenshotContainer");
  const slides = container?.querySelectorAll(".screenshot-slide") || [];
  const slideWidth = container.offsetWidth / 3;
  const maxSlide = Math.max(0, slides.length - 3);
  if (currentSlide < maxSlide) {
    currentSlide++;
    container.scrollTo({ left: currentSlide * slideWidth, behavior: "smooth" });
  }
};

// Init app
document.addEventListener("DOMContentLoaded", () => {
  if (appListElement) {
    renderAppList();
    setupCategoryFilters();
    searchInput?.addEventListener("keyup", e => e.key === "Enter" && searchApps());

    appListElement.addEventListener("click", e => {
      const card = e.target.closest(".app-card");
      if (card && !e.target.classList.contains("download-btn")) {
        location.href = `details.html?slug=${card.dataset.slug}`;
      }
    });
  }

  if (detailsElement) {
    loadAppDetails();
  }
});
