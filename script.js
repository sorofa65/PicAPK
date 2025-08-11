"use strict";

let currentSlide = 0;
let commCurrentPage = 0;
const commAppsPerPage = 6;

// DOM references
const appListElement = document.getElementById("appList");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll("[data-category]");
const detailsElement = document.getElementById("appDetails");
const commAppsGrid = document.querySelector(".communication-apps-grid");
const commPagination = document.querySelector(".pagination-dots");
const commLeftArrow = document.querySelector(".left-arrow");
const commRightArrow = document.querySelector(".right-arrow");
const commViewAllBtn = document.querySelector(".view-all-btn");

// Communication Apps Data
const commAppsData = [
    {
        id: "telegram",
        name: "Telegram X",
        description: "Fast and secure messaging app",
        icon: "fab fa-telegram",
        color: "linear-gradient(45deg, #0088cc, #00bcd4)",
        rating: 3.9,
        downloads: "500M+",
        size: "45MB",
        version: "9.4.1"
    },
    {
        id: "proton",
        name: "Proton Mail",
        description: "Encrypted Email",
        icon: "fas fa-lock",
        color: "linear-gradient(45deg, #6D4AFF, #8E2DE2)",
        rating: 4.2,
        downloads: "50M+",
        size: "85MB",
        version: "3.0.5"
    },
    {
        id: "zoom",
        name: "Zoom Workplace",
        description: "Video conferencing and collaboration",
        icon: "fas fa-video",
        color: "linear-gradient(45deg, #2D8CFF, #1E5EB6)",
        rating: 4.3,
        downloads: "1B+",
        size: "210MB",
        version: "5.15.0"
    },
    {
        id: "zoom-controller",
        name: "Zoom Rooms Controller",
        description: "Control Zoom conference rooms",
        icon: "fas fa-cogs",
        color: "linear-gradient(45deg, #1E5EB6, #0d3a7d)",
        rating: 4.0,
        downloads: "10M+",
        size: "75MB",
        version: "5.15.0"
    },
    {
        id: "kakao",
        name: "KakaoTalk : Messenger",
        description: "Popular messenger in South Korea",
        icon: "fas fa-comment-dots",
        color: "linear-gradient(45deg, #FFCD00, #FF9800)",
        rating: 3.6,
        downloads: "150M+",
        size: "120MB",
        version: "10.2.2"
    },
    {
        id: "messages",
        name: "Messages Lite",
        description: "Text Messages",
        icon: "fas fa-sms",
        color: "linear-gradient(45deg, #4CAF50, #2E7D32)",
        rating: 4.0,
        downloads: "100M+",
        size: "12MB",
        version: "7.9.321"
    },
    {
        id: "email",
        name: "Email",
        description: "Fast & Secure Mail",
        icon: "fas fa-envelope",
        color: "linear-gradient(45deg, #EA4335, #c5221f)",
        rating: 4.7,
        downloads: "500M+",
        size: "65MB",
        version: "6.0.45"
    },
    {
        id: "gmail",
        name: "Gmail Go",
        description: "Lightweight version of Gmail",
        icon: "fab fa-google",
        color: "linear-gradient(45deg, #34A853, #0f9d58)",
        rating: 4.1,
        downloads: "1B+",
        size: "25MB",
        version: "2023.09.03"
    }
];

// Initialize Communication Apps
const initCommApps = () => {
    if (!commAppsGrid) return;
    
    renderCommApps();
    setupCommPagination();
    
    // Event listeners for arrows
    if (commLeftArrow) {
        commLeftArrow.addEventListener("click", () => {
            const totalPages = Math.ceil(commAppsData.length / commAppsPerPage);
            if (commCurrentPage > 0) {
                commCurrentPage--;
                renderCommApps();
                updateCommPagination();
            }
        });
    }
    
    if (commRightArrow) {
        commRightArrow.addEventListener("click", () => {
            const totalPages = Math.ceil(commAppsData.length / commAppsPerPage);
            if (commCurrentPage < totalPages - 1) {
                commCurrentPage++;
                renderCommApps();
                updateCommPagination();
            }
        });
    }
    
    if (commViewAllBtn) {
        commViewAllBtn.addEventListener("click", () => {
            commCurrentPage = 0;
            commAppsPerPage = commAppsData.length;
            renderCommApps();
            updateCommPagination();
        });
    }
};

// Render Communication Apps
const renderCommApps = () => {
    const startIndex = commCurrentPage * commAppsPerPage;
    const endIndex = startIndex + commAppsPerPage;
    const appsToShow = commAppsData.slice(startIndex, endIndex);
    
    commAppsGrid.innerHTML = appsToShow.map(app => `
        <div class="comm-app-card" data-id="${app.id}">
            <div class="comm-app-icon" style="background: ${app.color}">
                <i class="${app.icon}"></i>
            </div>
            <h3 class="comm-app-name">${app.name}</h3>
            <p class="comm-app-description">${app.description}</p>
            <div class="comm-app-rating">
                <div class="comm-stars">${generateStars(app.rating)}</div>
                <span class="comm-rating-value">${app.rating}</span>
            </div>
            <a href="#" class="comm-download-btn" download>
                <i class="fas fa-download me-1"></i> Download (${app.size})
            </a>
        </div>
    `).join("");
};

// Generate star ratings
const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
};

// Setup Communication Apps Pagination
const setupCommPagination = () => {
    if (!commPagination) return;
    
    const totalPages = Math.ceil(commAppsData.length / commAppsPerPage);
    commPagination.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("div");
        dot.className = `pagination-dot ${i === commCurrentPage ? "active" : ""}`;
        dot.dataset.page = i;
        
        dot.addEventListener("click", () => {
            commCurrentPage = i;
            renderCommApps();
            updateCommPagination();
        });
        
        commPagination.appendChild(dot);
    }
};

// Update Communication Apps Pagination
const updateCommPagination = () => {
    const dots = document.querySelectorAll(".pagination-dot");
    dots.forEach((dot, index) => {
        if (index === commCurrentPage) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
};

// Rest of your existing functions remain the same
// fetchAPKData, renderAppList, searchApps, setupCategoryFilters, loadAppDetails, slideLeft, slideRight

// Modified init function
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
    
    // Initialize Communication Apps
    initCommApps();
});
