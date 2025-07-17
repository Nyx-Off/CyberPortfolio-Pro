// ===== Boot Sequence Animation =====
window.addEventListener('DOMContentLoaded', () => {
    const bootSequence = document.getElementById('boot-sequence');
    const terminalText = bootSequence.querySelector('.terminal-text');
    
    const bootMessages = [
        'Initializing system...',
        'Loading kernel modules...',
        'Mounting file systems...',
        'Starting network services...',
        'Loading security protocols...',
        'System ready.',
        'Welcome to the Matrix.'
    ];
    
    let messageIndex = 0;
    
    function typeMessage() {
        if (messageIndex < bootMessages.length) {
            terminalText.innerHTML += bootMessages[messageIndex] + '\n';
            messageIndex++;
            setTimeout(typeMessage, 200);
        } else {
            setTimeout(() => {
                bootSequence.classList.add('hidden');
                initMatrixRain();
                startTypewriter();
            }, 500);
        }
    }
    
    typeMessage();
});

// ===== Matrix Rain Effect =====
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#dc143c';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

// ===== Typewriter Effect =====
function startTypewriter() {
    const roleElement = document.getElementById('role-text');
    const roles = ['Administrateur Réseaux', 'Expert Cybersécurité', 'Développeur'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            setTimeout(() => {
                isDeleting = true;
                type();
            }, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ===== Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Navbar background on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScroll = currentScroll;
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('language-item')) {
                const progressBar = entry.target.querySelector('.progress');
                const width = progressBar.style.width;
                progressBar.style.width = '0';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
    document.querySelectorAll('.experience-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    document.querySelectorAll('.skill-category').forEach((category, index) => {
        category.classList.add('fade-in');
        category.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(category);
    });
});

// ===== Audio Visualization =====
document.addEventListener('DOMContentLoaded', () => {
    const audioViz = document.getElementById('audio-viz');
    const audio = document.getElementById('testimonial-audio');
    
    // Create visualization bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        audioViz.appendChild(bar);
    }
    
    const bars = audioViz.querySelectorAll('.audio-bar');
    
    // Animate bars when audio is playing
    audio.addEventListener('play', () => {
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    });
    
    audio.addEventListener('pause', () => {
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    });
    
    audio.addEventListener('ended', () => {
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    });
});

// ===== Terminal Commands Easter Egg =====
let commandHistory = [];
let historyIndex = -1;

document.addEventListener('keydown', (e) => {
    // Check if user pressed Ctrl+Shift+K
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        createTerminalPopup();
    }
});

function createTerminalPopup() {
    const existingTerminal = document.getElementById('terminal-popup');
    if (existingTerminal) {
        existingTerminal.remove();
        return;
    }
    
    const terminal = document.createElement('div');
    terminal.id = 'terminal-popup';
    terminal.innerHTML = `
        <div class="terminal-popup">
            <div class="terminal-popup-header">
                <span class="terminal-popup-title">root@portfolio:~#</span>
                <span class="terminal-popup-close">×</span>
            </div>
            <div class="terminal-popup-body">
                <div class="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">$</span>
                    <input type="text" class="terminal-input" autofocus>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(terminal);
    
    const input = terminal.querySelector('.terminal-input');
    const output = terminal.querySelector('.terminal-output');
    const closeBtn = terminal.querySelector('.terminal-popup-close');
    
    closeBtn.addEventListener('click', () => terminal.remove());
    
    const commands = {
        help: 'Available commands: help, about, skills, contact, clear, matrix, exit',
        about: 'Samy Bensalem - Cybersecurity Professional & Network Administrator',
        skills: 'Languages: C++, Python, JavaScript, PHP, SQL | Tools: Linux, Active Directory, Shell/Bash',
        contact: 'Email: contact@bensalemdev.fr | Professional: samy.bensalem@etik.com',
        clear: () => { output.innerHTML = ''; return 'Terminal cleared'; },
        matrix: () => { 
            document.getElementById('matrix-rain').style.opacity = '0.3'; 
            setTimeout(() => {
                document.getElementById('matrix-rain').style.opacity = '0.1';
            }, 5000);
            return 'Matrix mode activated for 5 seconds';
        },
        exit: () => { terminal.remove(); return ''; }
    };
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            
            // Add to output
            output.innerHTML += `<div><span class="terminal-prompt">$</span> ${input.value}</div>`;
            
            // Process command
            if (commands[command]) {
                const result = typeof commands[command] === 'function' ? commands[command]() : commands[command];
                if (result) {
                    output.innerHTML += `<div>${result}</div>`;
                }
            } else if (command) {
                output.innerHTML += `<div>Command not found: ${command}. Type 'help' for available commands.</div>`;
            }
            
            // Add to history
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
            }
            
            // Clear input
            input.value = '';
            
            // Scroll to bottom
            output.scrollTop = output.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });
    
    // Add terminal popup styles
    const style = document.createElement('style');
    style.textContent = `
        #terminal-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            animation: terminal-popup-open 0.3s ease;
        }
        
        @keyframes terminal-popup-open {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        .terminal-popup {
            width: 600px;
            max-width: 90vw;
            background-color: #0a0a0a;
            border: 2px solid #dc143c;
            border-radius: 8px;
            box-shadow: 0 0 50px rgba(220, 20, 60, 0.5);
        }
        
        .terminal-popup-header {
            background-color: #1a1a1a;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
        }
        
        .terminal-popup-title {
            color: #dc143c;
            font-size: 14px;
        }
        
        .terminal-popup-close {
            color: #808080;
            font-size: 24px;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .terminal-popup-close:hover {
            color: #dc143c;
        }
        
        .terminal-popup-body {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .terminal-output {
            margin-bottom: 20px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            color: #00ff00;
        }
        
        .terminal-input-line {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .terminal-input {
            flex: 1;
            background: none;
            border: none;
            outline: none;
            color: #00ff00;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
    
    input.focus();
}

// ===== Add some style variations on hover =====
document.addEventListener('DOMContentLoaded', () => {
    // Add glitch effect to section titles on hover
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.animation = 'glitch 0.3s';
            setTimeout(() => {
                title.style.animation = '';
            }, 300);
        });
    });
});