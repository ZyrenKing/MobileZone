// script.js - Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let siteConfig = null;
    let phonesData = null;

    // Initialize application
    initApplication();

    /**
     * Initialize the entire application
     */
    function initApplication() {
        // Load configuration files
        loadSiteConfig();
        loadPhonesData();

        // Initialize UI interactions
        initializeNavbar();
        initializeMobileMenu();
        initializeModal();
        initializeSmoothScroll();
        initializeScrollSpy();
    }

    /**
     * Load site configuration from setup.json
     */
    function loadSiteConfig() {
        fetch('setup.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load setup.json');
                return response.json();
            })
            .then(data => {
                siteConfig = data;
                applySiteConfiguration(data);
                console.log('Site configuration loaded successfully');
            })
            .catch(error => {
                console.warn('Could not load setup.json, using defaults:', error.message);
            });
    }

    /**
     * Load phones data from offers.json
     */
    function loadPhonesData() {
        fetch('offers.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load offers.json');
                return response.json();
            })
            .then(data => {
                phonesData = data;
                renderPhoneCards(data.phones);
                console.log('Phones data loaded successfully');
            })
            .catch(error => {
                console.error('Could not load offers.json:', error.message);
                const grid = document.getElementById('offersGrid');
                if (grid) {
                    grid.innerHTML = '<p style="text-align: center; color: var(--brand-30);">تعذر تحميل بيانات الجوالات</p>';
                }
            });
    }

    /**
     * Apply site configuration from setup.json
     */
    function applySiteConfiguration(config) {
        const root = document.documentElement;

        // Apply brand colors
        if (config.colors && config.colors.purple) {
            Object.entries(config.colors.purple).forEach(([key, value]) => {
                root.style.setProperty(`--brand-${key}`, value);
            });
        }

        // Apply dark colors
        if (config.colors && config.colors.dark) {
            Object.entries(config.colors.dark).forEach(([key, value]) => {
                root.style.setProperty(`--dark-${key}`, value);
            });
        }

        // Apply spacing
        if (config.spacing) {
            Object.entries(config.spacing).forEach(([key, value]) => {
                root.style.setProperty(`--space-${key}`, value);
            });
        }

        // Apply radius
        if (config.radius) {
            Object.entries(config.radius).forEach(([key, value]) => {
                root.style.setProperty(`--radius-${key}`, value);
            });
        }

        // Apply brand name
        if (config.brand && config.brand.name) {
            const brandNameEl = document.getElementById('brandName');
            const pageTitleEl = document.getElementById('page-title');
            if (brandNameEl) brandNameEl.textContent = config.brand.name;
            if (pageTitleEl) pageTitleEl.textContent = config.brand.name;
        }

        // Apply hero content
        if (config.brand && config.brand.tagline) {
            const heroTitleEl = document.getElementById('heroTitle');
            if (heroTitleEl) heroTitleEl.textContent = config.brand.tagline;
        }

        if (config.brand && config.brand.heroSubtitle) {
            const heroSubtitleEl = document.getElementById('heroSubtitle');
            if (heroSubtitleEl) heroSubtitleEl.textContent = config.brand.heroSubtitle;
        }

        // Apply hero background image
        if (config.hero && config.hero.image) {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.style.setProperty('--hero-bg', `url('${config.hero.image}')`);
            }
        }

        // Apply social links
        if (config.social) {
            const whatsappBtn = document.getElementById('whatsappBtn');
            const locationBtn = document.getElementById('locationBtn');
            const facebookLink = document.getElementById('facebookLink');

            if (whatsappBtn && config.social.whatsapp) {
                whatsappBtn.href = config.social.whatsapp;
            }
            if (locationBtn && config.social.location) {
                locationBtn.href = config.social.location;
            }
            if (facebookLink && config.social.facebook) {
                facebookLink.href = config.social.facebook;
            }
        }

        // Apply work hours
        if (config.workHours) {
            const openTimeEl = document.getElementById('openTime');
            const closeTimeEl = document.getElementById('closeTime');

            if (openTimeEl && config.workHours.open) {
                openTimeEl.textContent = config.workHours.open;
            }
            if (closeTimeEl && config.workHours.close) {
                closeTimeEl.textContent = config.workHours.close;
            }
        }
    }

    /**
     * Render phone cards in the offers grid
     */
    function renderPhoneCards(phones) {
        const grid = document.getElementById('offersGrid');
        if (!phones || !grid) return;

        grid.innerHTML = '';

        phones.forEach((phone, index) => {
            const card = document.createElement('div');
            card.className = 'phone-card glass-effect';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="card-image">
                    <img src="${phone.image}" alt="${phone.name}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${phone.name}</h3>
                    <div class="card-price">${phone.price} ريال</div>
                    <button class="btn btn-primary btn-glow details-btn" data-phone-id="${phone.id}">
                        <i class="fa-solid fa-circle-info"></i>
                        <span>عرض التفاصيل</span>
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

        // Add click event listeners to details buttons
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', handleDetailsClick);
        });
    }

    /**
     * Handle details button click
     */
    function handleDetailsClick(event) {
        event.preventDefault();
        const phoneId = parseInt(event.currentTarget.dataset.phoneId);
        const phone = phonesData.phones.find(p => p.id === phoneId);
        if (phone) {
            openPhoneModal(phone);
        }
    }

    /**
     * Open phone details modal
     */
    function openPhoneModal(phone) {
        const overlay = document.getElementById('modalOverlay');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalPrice = document.getElementById('modalPrice');
        const modalDescription = document.getElementById('modalDescription');
        const modalBattery = document.getElementById('modalBattery');
        const modalScreen = document.getElementById('modalScreen');
        const modalProcessor = document.getElementById('modalProcessor');
        const modalRam = document.getElementById('modalRam');
        const modalStorage = document.getElementById('modalStorage');

        // Populate modal content
        if (modalImage) {
            modalImage.src = phone.image;
            modalImage.alt = phone.name;
        }
        if (modalTitle) modalTitle.textContent = phone.name;
        if (modalPrice) modalPrice.textContent = `${phone.price} ريال`;
        if (modalDescription) modalDescription.textContent = phone.description || '';
        if (modalBattery) modalBattery.textContent = phone.battery;
        if (modalScreen) modalScreen.textContent = phone.screen;
        if (modalProcessor) modalProcessor.textContent = phone.processor;
        if (modalRam) modalRam.textContent = phone.ram;
        if (modalStorage) modalStorage.textContent = phone.storage;

        // Set up order button
        const orderBtn = document.getElementById('modalOrderBtn');
        if (orderBtn) {
            orderBtn.onclick = () => {
                if (siteConfig && siteConfig.social && siteConfig.social.whatsapp) {
                    const message = encodeURIComponent(`مرحباً، أرغب في طلب ${phone.name} بسعر ${phone.price} ريال`);
                    window.open(`${siteConfig.social.whatsapp}?text=${message}`, '_blank');
                }
            };
        }

        // Show modal
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close phone details modal
     */
    function closePhoneModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Initialize navbar scroll effects
     */
    function initializeNavbar() {
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Initialize mobile menu toggle
     */
    function initializeMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (!menuToggle || !navLinks) return;

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Update icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking on a link (mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    /**
     * Initialize modal interactions
     */
    function initializeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        if (!modalOverlay || !modalClose) return;

        // Close on button click
        modalClose.addEventListener('click', closePhoneModal);

        // Close on overlay click
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closePhoneModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closePhoneModal();
            }
        });
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    /**
 * Initialize smooth scrolling for anchor links
 */
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (event) {
                const targetId = this.getAttribute('href');

                const target = document.querySelector(targetId);
                if (target) {
                    event.preventDefault();
                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize scroll spy for active navigation
     */
    function initializeScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', () => {
            let current = '';
            const navbarHeight = document.getElementById('navbar').offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight - 100;
                const sectionHeight = section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
});