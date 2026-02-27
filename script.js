// --- DYNAMIC YEAR ---
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// --- BACKGROUND CANVAS EFFECTS ENGINE (OPTIMIZED) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;
let globalHue = 0; // Driven dynamic color shifting for stars

function resizeCanvas() {
    // Scale down internal resolution for massive performance boost
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;
}

// Debounce resize to prevent lag
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 100);
});
resizeCanvas();

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.hueOffset = Math.random() * 40; 
    }
    update() {
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha <= 0.1 || this.alpha >= 0.8) this.twinkleDir *= -1;
    }
    draw() {
        // Color shifting auroral star effect
        ctx.fillStyle = `hsla(${180 + globalHue + this.hueOffset}, 70%, 85%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ShootingStar {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width * 1.5;
        this.y = 0;
        this.length = Math.random() * 60 + 20;
        this.speed = Math.random() * 8 + 4;
        this.angle = Math.PI / 4; 
        this.active = false;
        this.delay = Math.random() * 300 + 100;
        this.timer = 0;
    }
    update() {
        if (!this.active) {
            this.timer++;
            if (this.timer > this.delay) { this.active = true; this.timer = 0; }
            return;
        }
        this.x -= this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.x < -100 || this.y > canvas.height + 100) this.reset();
    }
    draw() {
        if (!this.active) return;
        ctx.strokeStyle = `hsla(${200 + globalHue}, 80%, 90%, 0.8)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
        ctx.stroke();
    }
}

class Blossom {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; 
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 2.5 + 1.5;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.05 - 0.025;
        
        // Realistic Cherry Blossom Colors
        const blossomHues = [330, 340, 345]; 
        const hue = blossomHues[Math.floor(Math.random() * blossomHues.length)];
        const lightness = Math.random() * 15 + 80; 
        this.color = `hsla(${hue}, 70%, ${lightness}%, 0.75)`; 
    }
    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.angle) * 0.8; 
        this.angle += this.spin;
        if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Reduced counts for smoother performance
let stars = Array.from({length: 30}, () => new Star());
let shootingStars = Array.from({length: 1}, () => new ShootingStar());
let blossoms = Array.from({length: 25}, () => new Blossom());

function animateEffects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    globalHue = (globalHue + 0.1) % 360; // Advance color shift slowly for stars

    const isDark = document.body.getAttribute('data-theme') === 'dark';

    if (isDark) {
        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars.forEach(ss => { ss.update(); ss.draw(); });
    } else {
        blossoms.forEach(b => { b.update(); b.draw(); });
    }
    animationFrameId = requestAnimationFrame(animateEffects);
}
animateEffects();

// --- 3D TILT EFFECT LOGIC ---
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    if (window.innerWidth > 768) { 
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; 
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
});

// --- SCROLL PROGRESS BAR ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
};

// --- POPUP LOGIC ---
function togglePopup(id) {
    const popup = document.getElementById(id);
    if (popup.style.display === 'flex') {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'flex';
    }
}

// --- CASE STUDY DATA & INJECTION ---
const caseStudies = {
    'origin': {
        title: 'Origin Code Technology',
        tag: 'WordPress Development',
        img: 'images/ORIGIN CODE TECHNOLOGY SOLUTIONS.png',
        done: [
            'Led the UI/UX redesign of the corporate website to modernize their brand identity.',
            'Set up and configured backend administrative tools for smoother operations.',
            'Streamlined the client onboarding workflow using custom forms.',
            'Implemented custom CSS and optimized existing plugins.'
        ],
        results: [
            'Reduced client onboarding time by over 40%.',
            'Improved overall page load speed by 2.5 seconds.',
            'Enhanced overall user experience, directly leading to lower bounce rates.'
        ]
    },
    'ipoppet': {
        title: 'Ipoppet Store',
        tag: 'WordPress eCommerce',
        img: 'images/IPOPPET.png',
        done: [
            'Managed day-to-day WooCommerce store operations.',
            'Uploaded and optimized new product listings with correct taxonomy.',
            'Integrated and configured a live customer support chat widget.',
            'Handled inventory synchronization to prevent overselling.'
        ],
        results: [
            'Increased monthly product turnover through better categorization.',
            'Boosted customer satisfaction scores by 35% via the new live chat.',
            'Maintained zero inventory discrepancies over a 6-month period.'
        ]
    },
    'artic': {
        title: 'Artic Flex',
        tag: 'WordPress Optimization',
        img: 'images/ARTICFLEX.png',
        done: [
            'Performed comprehensive site speed audits to locate bottlenecks.',
            'Optimized heavy images, minified CSS/JS, and configured advanced caching.',
            'Updated and structured SEO content for key landing pages.',
            'Fixed broken links and resolved crawl errors in Google Search Console.'
        ],
        results: [
            'Achieved 90+ scores on Google PageSpeed Insights for both Mobile and Desktop.',
            'Increased organic search traffic by 25% in 3 months.',
            'Improved conversion rate due to significantly faster checkout loading.'
        ]
    }
};

function openCaseStudy(id) {
    const data = caseStudies[id];
    const content = `
        <i class="fas fa-times acl-close-trigger" onclick="togglePopup('caseStudyModal')" style="color: white; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; right: 20px; top: 20px;"></i>
        <div class="acl-case-header">
            <img src="${data.img}" alt="${data.title}">
        </div>
        <div class="acl-case-body">
            <div class="acl-case-meta">${data.tag}</div>
            <h2 class="acl-case-title">${data.title}</h2>
            
            <div class="acl-case-grid">
                <div class="acl-case-section">
                    <h4><i class="fas fa-hammer"></i> What I Have Done</h4>
                    <ul>
                        ${data.done.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="acl-case-section">
                    <h4><i class="fas fa-chart-line"></i> The Results</h4>
                    <ul>
                        ${data.results.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.getElementById('caseStudyModalContent').innerHTML = content;
    togglePopup('caseStudyModal');
}

// --- AJAX FORM SUBMISSION (WEB3FORMS) ---
const form = document.getElementById('aclContactForm');
const formContent = document.getElementById('formContentContainer');
const successMsg = document.getElementById('successMessage');
const status = document.getElementById('formStatus');

form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    status.style.display = 'block';
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            form.reset();
            status.style.display = 'none';
            formContent.style.display = 'none';
            successMsg.style.display = 'block';
        } else {
            console.log(response);
            status.innerHTML = json.message;
            status.style.color = 'red';
        }
    })
    .catch(error => {
        console.log(error);
        status.innerHTML = "Something went wrong!";
        status.style.color = 'red';
    });
});

// --- MOBILE MENU LOGIC ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.acl-burger-btn i');
    
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        btn.classList.replace('fa-times', 'fa-bars');
    } else {
        menu.classList.add('active');
        btn.classList.replace('fa-bars', 'fa-times');
    }
}

// --- STATS ANIMATION ---
const statsSection = document.querySelector('.acl-quick-stats');
const counters = document.querySelectorAll('.count');
let started = false;

const startCounting = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const speed = 200; 
                const increment = target / speed;

                const updateCount = () => {
                    const c = +counter.innerText;
                    if (c < target) {
                        counter.innerText = Math.ceil(c + increment);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            started = true;
            observer.unobserve(statsSection);
        }
    });
};

const statsObserver = new IntersectionObserver(startCounting, { threshold: 0.5 });
if (statsSection) statsObserver.observe(statsSection);

// --- SERVICE MODAL CONTENT ---
const serviceContent = {
    'va': `
        <h2 style="margin-bottom:15px; color:var(--acl-text-main);">Executive Virtual Assistant</h2>
        <p style="color:var(--acl-text-muted); margin-bottom:20px;">I act as your right hand, managing the operational side of your business so you can focus on growth.</p>
        <ul style="text-align:left; color:var(--acl-text-main); margin-bottom:20px; padding-left:20px;">
            <li style="margin-bottom:10px;"><strong>Inbox Management:</strong> Achieving Inbox Zero and prioritizing urgent communications.</li>
            <li style="margin-bottom:10px;"><strong>Calendar Management:</strong> Scheduling meetings across time zones.</li>
            <li style="margin-bottom:10px;"><strong>Data Entry & CRM:</strong> Keeping HubSpot, Salesforce, or Google Sheets up to date.</li>
        </ul>
    `,
    'ecom': `
        <h2 style="margin-bottom:15px; color:var(--acl-text-main);">eCommerce Operations</h2>
        <p style="color:var(--acl-text-muted); margin-bottom:20px;">Specialized support for Shopify and WooCommerce store owners.</p>
        <ul style="text-align:left; color:var(--acl-text-main); margin-bottom:20px; padding-left:20px;">
            <li style="margin-bottom:10px;"><strong>Product Uploads:</strong> Creating SEO-friendly product listings.</li>
            <li style="margin-bottom:10px;"><strong>Inventory Management:</strong> Tracking stock levels and coordinating with suppliers.</li>
            <li style="margin-bottom:10px;"><strong>Order Fulfillment:</strong> Processing orders and managing returns/refunds.</li>
        </ul>
    `,
    'dev': `
        <h2 style="margin-bottom:15px; color:var(--acl-text-main);">Front-End Development</h2>
        <p style="color:var(--acl-text-muted); margin-bottom:20px;">Technical implementation and styling tweaks for WordPress websites.</p>
        <ul style="text-align:left; color:var(--acl-text-main); margin-bottom:20px; padding-left:20px;">
            <li style="margin-bottom:10px;"><strong>HTML5 & CSS3:</strong> Custom styling.</li>
            <li style="margin-bottom:10px;"><strong>WordPress Maintenance:</strong> Plugin updates, backups, and security checks.</li>
            <li style="margin-bottom:10px;"><strong>Speed Optimization:</strong> Improving Core Web Vitals.</li>
        </ul>
    `
};

function openServiceDetails(type) {
    const container = document.getElementById('serviceModalContent');
    container.innerHTML = serviceContent[type];
    togglePopup('serviceModal');
}

// --- THEME TOGGLE LOGIC (UNIFIED) ---
const themeBtnDesktop = document.getElementById('themeToggle');
const themeBtnMobile = document.getElementById('mobileThemeToggle');

const iconDesktop = themeBtnDesktop.querySelector('i');
const iconMobile = themeBtnMobile.querySelector('i');
const textMobile = themeBtnMobile.querySelector('span');

const body = document.body;

// Init
if(localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
    updateIcons(true);
}

function updateIcons(isDark) {
    if(isDark) {
        iconDesktop.classList.replace('fa-moon', 'fa-sun');
        iconMobile.classList.replace('fa-moon', 'fa-sun');
        textMobile.innerText = "Light Mode";
    } else {
        iconDesktop.classList.replace('fa-sun', 'fa-moon');
        iconMobile.classList.replace('fa-sun', 'fa-moon');
        textMobile.innerText = "Dark Mode";
    }
}

function toggleTheme() {
    if(body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateIcons(false);
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateIcons(true);
    }
}

themeBtnDesktop.addEventListener('click', toggleTheme);
themeBtnMobile.addEventListener('click', toggleTheme);

// --- SCROLL ANIMATION ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.acl-section').forEach(sec => observer.observe(sec));

// --- NAV ACTIVE STATE ---
const sections = document.querySelectorAll('.acl-section, #home');
const navItems = document.querySelectorAll('.acl-nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if(pageYOffset >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    })
})