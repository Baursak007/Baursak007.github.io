/* ==========================================================================
   CYBERNETIC INTERACTIVITY & TERMINAL DISPATCHER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Cursor Glow
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(updateCursor);
        };
        requestAnimationFrame(updateCursor);
    }

    // 2. HUD Header Scroll State
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. Mobile Navigation Drawer
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const drawerClose = document.getElementById('drawerClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = (open) => {
        if (open) {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            burger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    };

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => toggleMenu(true));
        if (drawerClose) drawerClose.addEventListener('click', () => toggleMenu(false));
        mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    }

    // 4. Metrics Number Counter on Scroll (IntersectionObserver)
    const metricValues = document.querySelectorAll('.metric-value');
    let counted = false;

    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let start = 0;
        const duration = 1800;
        const stepTime = 30;
        const step = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = start;
            }
        }, stepTime);
    };

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                metricValues.forEach(val => countUp(val));
                counted = true;
            }
        });
    }, { threshold: 0.5 });

    const heroMetrics = document.querySelector('.hero-metrics');
    if (heroMetrics) metricObserver.observe(heroMetrics);

    // 5. Project Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.cyber-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 6. Interactive Bot Simulator / Cyber Terminal
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalForm = document.getElementById('terminalForm');
    const terminalInput = document.getElementById('terminalInput');
    const termChips = document.querySelectorAll('.term-chip');

    const appendMessage = (sender, text, type) => {
        const line = document.createElement('div');
        line.className = `term-line ${type}`;

        const prompt = document.createElement('span');
        prompt.className = 't-prompt';
        prompt.textContent = sender;

        const msg = document.createElement('span');
        msg.className = 't-msg';
        msg.innerHTML = text;

        line.appendChild(prompt);
        line.appendChild(msg);
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const botResponses = {
        '/calc': 'Стоимость разработки лендинга под ключ стартует от 3-4 дней с проработкой смыслов и адаптива. Напишите в блок ниже или в Telegram @auramonster для точной сметы.',
        '/bot_wa': 'WhatsApp-бот подключается через официальный API или шлюз. Он автоматически отвечает клиентам 24/7, отправляет прайс, меню, записывает на прием и дублирует данные в Google Sheets или amoCRM.',
        '/lead': 'Принято! Вы можете заполнить форму ниже в блоке контактов, либо написать напрямую в Telegram: <a href="https://t.me/auramonster" target="_blank" style="color: #00f0ff; text-decoration: underline;">@auramonster</a>.',
        '/contact': 'Прямые каналы: Telegram: @auramonster | WhatsApp: +7 (747) 947-38-41 | Email: akmaral.koptleuova@inbox.ru'
    };

    const handleCommand = (cmdText) => {
        const cleanCmd = cmdText.trim();
        if (!cleanCmd) return;

        appendMessage('[USER]', cleanCmd, 'user');

        setTimeout(() => {
            const matchedKey = Object.keys(botResponses).find(k => cleanCmd.toLowerCase().includes(k.replace('/', '')) || cleanCmd === k);
            if (matchedKey) {
                appendMessage('[BOT]', botResponses[matchedKey], 'bot');
            } else if (cleanCmd.toLowerCase().includes('цен') || cleanCmd.toLowerCase().includes('стоим')) {
                appendMessage('[BOT]', 'Стоимость зависит от сложности: лендинг (от $150), бот с базовой логикой (от $100), сложный Mini App с оплатой (от $350). Давайте обсудим детали!', 'bot');
            } else if (cleanCmd.toLowerCase().includes('привет') || cleanCmd.toLowerCase().includes('здравствуй')) {
                appendMessage('[BOT]', 'Приветствую! Готов помочь автоматизировать рутину и запустить быстрый сайт для ваших продаж.', 'bot');
            } else {
                appendMessage('[BOT]', `Команда принята в обработку. Рекомендую связаться напрямую в Telegram <a href="https://t.me/auramonster" target="_blank" style="color: #00f0ff;">@auramonster</a> — я на связи практически всегда.`, 'bot');
            }
        }, 400);
    };

    if (terminalForm && terminalInput) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = terminalInput.value;
            terminalInput.value = '';
            handleCommand(text);
        });
    }

    termChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            handleCommand(cmd);
        });
    });

    // 7. Cyber Contact Form with Interactive Feedback
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value.trim();
            const contact = document.getElementById('userContact').value.trim();
            const projectType = document.querySelector('input[name="projectType"]:checked').value;
            const message = document.getElementById('userMessage').value.trim();

            formStatus.className = 'form-status-msg';
            formStatus.innerHTML = '<span style="color: #00f0ff;">[СИСТЕМА] Шифрование и отправка данных пакета...</span>';

            setTimeout(() => {
                formStatus.className = 'form-status-msg success';
                formStatus.innerHTML = `[УСПЕХ] Заявка от <strong>${name}</strong> принята! Открываю Telegram для мгновенного подтверждения...`;

                const telegramText = encodeURIComponent(
                    `⚡ НОВАЯ ЗАЯВКА С САЙТА:\nИмя: ${name}\nКонтакт: ${contact}\nТип: ${projectType}\nЗадача: ${message || 'Не указано'}`
                );

                setTimeout(() => {
                    window.open(`https://t.me/auramonster?text=${telegramText}`, '_blank');
                    contactForm.reset();
                }, 1200);
            }, 800);
        });
    }

    // 8. 3D Tilt Effect on Service Panels
    const tiltPanels = document.querySelectorAll('[data-tilt]');
    if (window.matchMedia('(pointer: fine)').matches) {
        tiltPanels.forEach(panel => {
            panel.addEventListener('mousemove', (e) => {
                const rect = panel.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateX = (-y / rect.height) * 8;
                const rotateY = (x / rect.width) * 8;
                panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            panel.addEventListener('mouseleave', () => {
                panel.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }
});
