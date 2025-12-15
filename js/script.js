let currentFilter = 'all';
let currentSlideIndex = 0;

function filterProjects(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProjects();
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const filtered = currentFilter === 'all' ? projects : projects.filter(p => p.category === currentFilter);

    grid.innerHTML = filtered.map(project => `
        <div class="project-card" onclick="openProject(${project.id})">
            <div class="project-image">
                ${project.images?.length ? `<img src="${project.images[0]}" alt="${project.title}">` : ''}
                <div class="project-emoji">${project.icon}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">
                    ${project.title}
                    <span class="project-status">${project.status}</span>
                </h3>
                <div class="project-meta">
                    <span class="project-date">📅 ${project.date}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    observeCards();
}

function observeCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
}

function openProject(id) {
    const project = projects.find(p => p.id === id);
    const detailContent = document.getElementById('detailContent');

    detailContent.innerHTML = `
        <div class="detail-header">
            <div class="detail-emoji">${project.icon}</div>
            <div>
                <h2 class="detail-title">${project.title}</h2>
                <div class="detail-meta">
                    <span class="detail-meta-item">📅 ${project.date}</span>
                    <span class="detail-meta-item">🏷️ ${project.status}</span>
                    <span class="detail-meta-item">📁 ${project.category.toUpperCase()}</span>
                </div>
            </div>
        </div>

        <div class="detail-image-carousel">
            <div class="carousel-container">
                ${project.images?.length ? project.images.map((img, i) => `
                    <div class="carousel-slide ${i === 0 ? 'active' : ''}">
                        <img src="${img}" alt="${project.title}">
                    </div>
                `).join('') : `<div class="carousel-slide active">${project.icon}</div>`}
            </div>
            ${project.images?.length > 1 ? `
                <div class="carousel-controls">
                    <button class="carousel-btn" onclick="prevSlide()">❮</button>
                    <div class="carousel-indicators"></div>
                    <button class="carousel-btn" onclick="nextSlide()">❯</button>
                </div>
            ` : ''}
        </div>

        ${project.details.fullDescription ? `<p class="detail-description">${project.details.fullDescription}</p>` : ''}

        ${project.details.stats ? `
        <div class="stats-grid">
            ${project.details.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('')}
        </div>` : ''}

        <div class="detail-section">
            <h3>Основные функции</h3>
            <ul>
                ${project.details.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>

        <div class="detail-section">
            <h3>Технологии</h3>
            <p style="white-space: pre-line">${project.details.tech}</p>
        </div>

        <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;

    document.getElementById('projectDetail').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (project.images?.length > 1) initCarousel();
}

function closeProject() {
    document.getElementById('projectDetail').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('projectDetail').addEventListener('click', (e) => {
    if (e.target.id === 'projectDetail') closeProject();
});

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (!indicatorsContainer || !slides.length) return;

    indicatorsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(dot);
    });
    currentSlideIndex = 0;
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-indicator');
    if (!slides.length) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlideIndex = index;
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    goToSlide(currentSlideIndex > 0 ? currentSlideIndex - 1 : slides.length - 1);
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    goToSlide(currentSlideIndex < slides.length - 1 ? currentSlideIndex + 1 : 0);
}

renderProjects();