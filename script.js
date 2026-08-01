document.addEventListener("DOMContentLoaded", () => {
    // Force scroll to top on initial load to prevent browser scroll memory
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- 0. Global Setup ---
    const bgMusic = document.getElementById("bg-music");
    const miniPlayer = document.getElementById("mini-player");
    const miniPlayBtn = document.getElementById("mini-play-btn");
    const mainPlayBtn = document.getElementById("main-play-btn");
    const mainVolume = document.getElementById("main-volume");
    const vinyl = document.getElementById("vinyl");
    const visualizer = document.querySelector(".large-visualizer");
    let hasStartedMusic = false;

    // --- 1. Cinematic Preloader ---
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 2000);
    }, 3500);

    // --- 2. Virtual Page Navigation ---
    const pages = document.querySelectorAll('.page');
    
    function navigateToPage(targetId) {
        // Start music immediately on first user interaction to bypass browser autoplay restrictions
        if (!hasStartedMusic && targetId === "2") {
            startMusic();
        }

        // Fade out current active page
        const currentActive = document.querySelector('.page.active');
        if (currentActive) {
            currentActive.style.opacity = '0';
            setTimeout(() => {
                currentActive.classList.remove('active');
                
                // Reset scroll position so new page starts at the top
                window.scrollTo(0, 0);
                
                // Fade in new page
                const targetPage = document.getElementById(`page-${targetId}`);
                targetPage.classList.add('active');
                
                // Small delay before setting opacity to trigger CSS transition
                setTimeout(() => {
                    targetPage.style.opacity = '1';
                }, 50);

                // Show mini player from page 2 onwards, hide on page 5 (music page)
                if (targetId === "1" || targetId === "5") {
                    miniPlayer.classList.add("hidden");
                } else if (hasStartedMusic) {
                    miniPlayer.classList.remove("hidden");
                }

            }, 1200); // Wait for fade-out
        }
    }

    document.querySelectorAll('.nav-next, .nav-prev').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            navigateToPage(targetId);
        });
    });

    // --- 3. Music Management ---
    function startMusic() {
        bgMusic.play().catch(e => console.log("Audio play blocked."));
        hasStartedMusic = true;
        updateMusicUI();
    }

    function toggleMusic() {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
        updateMusicUI();
    }

    function updateMusicUI() {
        const isPaused = bgMusic.paused;
        miniPlayBtn.innerText = isPaused ? "▶️" : "⏸️";
        mainPlayBtn.innerText = isPaused ? "▶️" : "⏸️";
        
        if (isPaused) {
            vinyl.classList.remove("spinning");
            visualizer.classList.add("paused");
        } else {
            vinyl.classList.add("spinning");
            visualizer.classList.remove("paused");
        }
    }

    miniPlayBtn.addEventListener("click", toggleMusic);
    mainPlayBtn.addEventListener("click", toggleMusic);
    mainVolume.addEventListener("input", (e) => {
        bgMusic.volume = e.target.value;
    });

    // --- 4. Countdown Timer (Page 1) ---
    const startDate = new Date('2025-12-01T00:00:00');
    function updateCountdown() {
        const now = new Date();
        const diff = now - startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 5. Memory Gallery (Page 2) ---
    const grid = document.getElementById("masonry-grid");
    const totalPhotos = 13;
    const photos = [];
    
    for (let i = 1; i <= totalPhotos; i++) {
        const item = document.createElement("div");
        item.className = "gallery-item";
        
        const img = document.createElement("img");
        // FIX: Using .jpg.jpeg extension as requested
        img.src = `assets/photo${i}.jpg.jpeg`; 
        img.alt = `Memory ${i}`;
        img.loading = "lazy";
        
        img.onload = () => {
            item.classList.add("loaded");
        };

        item.appendChild(img);
        grid.appendChild(item);
        photos.push(img.src);
        
        item.addEventListener("click", () => openLightbox(i - 1));
    }

    // Lightbox Logic
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightboxBtn = document.querySelector(".close-lightbox");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentPhotoIndex = 0;

    function openLightbox(index) {
        currentPhotoIndex = index;
        lightboxImg.src = photos[currentPhotoIndex];
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
    }

    function changePhoto(step) {
        currentPhotoIndex += step;
        if (currentPhotoIndex < 0) currentPhotoIndex = photos.length - 1;
        if (currentPhotoIndex >= photos.length) currentPhotoIndex = 0;
        lightboxImg.src = photos[currentPhotoIndex];
    }

    closeLightboxBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => changePhoto(-1));
    nextBtn.addEventListener("click", () => changePhoto(1));
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // --- 6. Love Letter (Page 3) ---
    const envelope = document.getElementById("envelope");
    const letterContent = document.getElementById("letter-content");
    const signature = document.getElementById("signature");
    let envelopeOpened = false;

    const letterText = `To My Little Princess ❤️\n\nThis is for my little princess, the best girlfriend in the entire universe.\n\nYou are truly amazing in every possible way. Sometimes I wonder how I got so lucky to have someone as kind, caring, and beautiful as you in my life. You don't even realize how much happiness you bring into my world just by being yourself.\n\nYour presence feels like home. No matter how stressful, tiring, or confusing my day is, everything somehow becomes lighter the moment I'm with you. Being around you gives me a kind of peace that I never knew I needed.\n\nAnd your smile... ahhhh.\n\nI honestly don't think words are enough to describe what I feel when you smile, especially when you laugh like a little kid in front of me. It's one of the most beautiful things I've ever seen. Every time you laugh, it makes me want to pause time for a moment so I can live in that feeling forever. Your happiness becomes my happiness without me even realizing it.\n\nThank you for being a part of this little life of mine. Thank you for every smile, every conversation, every memory, every little moment, and every bit of love you've given me. You have made ordinary days feel extraordinary just by existing beside me.\n\nMeeting you has been one of the greatest blessings of my life. If someone ever asked me what my favorite place is, I'd probably say, "Wherever she's smiling." Because that's where I feel the happiest.\n\nI don't know what I did to deserve someone like you, but I promise I'll always be grateful that our paths crossed. You are not just my girlfriend—you are my comfort, my safe place, my biggest happiness, and the most precious person in my world.\n\nI hope you always remember how loved, appreciated, and special you are. Never forget that there is someone who looks at you and sees his entire world.\n\nI love you more than words could ever explain, baby girl.\n\nForever and always. ❤️`;

    envelope.addEventListener("click", () => {
        if (!envelopeOpened) {
            envelope.classList.add("open");
            document.querySelector(".envelope-wrapper").classList.add("expanded");
            envelopeOpened = true;
            
            setTimeout(() => {
                typeLetter(letterText, 0);
            }, 1200);
        }
    });

    function typeLetter(text, index) {
        if (index < text.length) {
            let char = text.charAt(index);
            if (char === '\n') {
                letterContent.innerHTML += '<br>';
            } else {
                letterContent.innerHTML += char;
            }
            
            const letterDiv = document.querySelector(".letter");
            letterDiv.scrollTop = letterDiv.scrollHeight;
            
            setTimeout(() => typeLetter(text, index + 1), 75);
        } else {
            setTimeout(() => {
                signature.classList.add("visible");
            }, 1000);
        }
    }

    // --- 7. Reasons I Love You (Page 4) ---
    const reasons = [
        { title: "Your smile ❤️", desc: "I love your smile because it has the power to instantly make my bad days better. Seeing you smile feels like seeing a little piece of happiness in front of me." },
        { title: "Your laugh", desc: "I love the way you laugh, especially when you laugh like a kid without caring about anything. That innocent happiness of yours is one of my favorite things in the world." },
        { title: "Your curly hair", desc: "I love your curly hair because it makes you even more you. It's one of those little things that makes you different and beautiful in my eyes." },
        { title: "The way you talk", desc: "I love listening to you talk, whether you are telling me something important, sharing random stories, or just saying silly things. Your voice feels comforting." },
        { title: "The way you care about me", desc: "I love how you notice the smallest things about me. Sometimes you understand what I feel even before I say it." },
        { title: "The way you become my mother sometimes", desc: "I love how you scold me when I don't take care of myself, remind me to eat, rest, and do the right things. Sometimes you become my girlfriend, and sometimes you become my little guardian angel." },
        { title: "Your childish side", desc: "I love the little kid inside you. The way you get excited about small things makes life more beautiful." },
        { title: "Your honesty", desc: "I love that you are always yourself with me. You don't pretend to be someone else, and that's one of the things I admire most about you." },
        { title: "Your kindness", desc: "I love how your heart is always full of care. The way you treat people shows what a beautiful person you are." },
        { title: "Your emotional side", desc: "I love how deeply you feel things. It shows that you have a heart that truly cares." },
        { title: "Your little habits", desc: "I love those small things you do without realizing them because those little moments become my favorite memories." },
        { title: "The way you make me feel special", desc: "I love how you make me feel important and loved. With you, I feel like I matter." },
        { title: "Your patience with me", desc: "I love how you handle my overthinking, my silly questions, and my complicated thoughts with so much understanding." },
        { title: "Your cute anger", desc: "I love when you get angry in your own cute way because even your complaints show how much you care." },
        { title: "Your supportive nature", desc: "I love how you believe in me and encourage me to become a better version of myself." },
        { title: "Your beautiful heart", desc: "I love you not just because of how you look, but because of the person you are from inside." },
        { title: "The way you make normal moments special", desc: "Even simple conversations with you become memories that I want to keep forever." },
        { title: "Your little surprises and efforts", desc: "I love every small effort you make because it shows how much love you put into our relationship." },
        { title: "Your confidence and uniqueness", desc: "I love that you have your own personality. You are not trying to be anyone else, and that's beautiful." },
        { title: "The way you say my name", desc: "I don't know why, but hearing my name from you feels different. It feels special." },
        { title: "Your dreams and ambitions", desc: "I love seeing you work toward your goals because I know how amazing you are and how much you can achieve." },
        { title: "The way you make me laugh", desc: "I love how you can turn boring moments into happy ones just by being yourself." },
        { title: "The comfort I feel with you", desc: "I love that I can be completely myself around you without pretending." },
        { title: "The memories we create together", desc: "I love every little moment we share because those moments become the stories I want to remember forever." },
        { title: "Simply because you are you ❤️", desc: "At the end of everything, I love you because you are you. Your smile, your heart, your craziness, your kindness, your imperfections, everything that makes you the person I fell in love with." },
        { title: "The biggest reason...", desc: "You are simply YOU ❤️" }
    ];

    let currentReasonIndex = 0;
    const reasonCard = document.getElementById("reason-card");
    const reasonTitle = document.getElementById("reason-title");
    const reasonDesc = document.getElementById("reason-desc");
    const currentReasonNum = document.getElementById("current-reason");
    const prevReasonBtn = document.getElementById("prev-reason");
    const nextReasonBtn = document.getElementById("next-reason");
    const indicator = document.querySelector(".progress-indicator");

    function updateReason(index) {
        reasonCard.classList.add("fade-out");
        
        setTimeout(() => {
            if (index === reasons.length - 1) {
                indicator.style.display = 'none';
            } else {
                indicator.style.display = 'block';
                currentReasonNum.innerText = index + 1;
            }
            
            reasonTitle.innerText = reasons[index].title;
            reasonDesc.innerText = reasons[index].desc;
            
            prevReasonBtn.disabled = index === 0;
            nextReasonBtn.style.display = index === reasons.length - 1 ? 'none' : 'inline-block';

            reasonCard.classList.remove("fade-out");
            reasonCard.classList.add("fade-in");
            
            setTimeout(() => reasonCard.classList.remove("fade-in"), 600);
        }, 600);
    }

    prevReasonBtn.addEventListener("click", () => {
        if (currentReasonIndex > 0) {
            currentReasonIndex--;
            updateReason(currentReasonIndex);
        }
    });

    nextReasonBtn.addEventListener("click", () => {
        if (currentReasonIndex < reasons.length - 1) {
            currentReasonIndex++;
            updateReason(currentReasonIndex);
        }
    });

    // --- 8. Final Surprise & Dramatic Reveal (Page 6) ---
    const secretHeart = document.getElementById("secret-heart");
    const finalReveal = document.getElementById("final-reveal");
    const surpriseTrigger = document.getElementById("surprise-trigger");
    
    secretHeart.addEventListener("click", () => {
        // Dramatic fade out of the heart
        secretHeart.style.transform = 'scale(4)';
        secretHeart.style.opacity = '0';
        
        setTimeout(() => {
            surpriseTrigger.style.display = 'none';
            finalReveal.classList.remove("hidden");
            
            // Trigger CSS reveal animations
            setTimeout(() => {
                finalReveal.classList.add("revealed");
            }, 100);
            
            createConfetti();
        }, 1000);
    });

    // --- Utility: Confetti Engine ---
    function createConfetti() {
        const colors = ['#f43f5e', '#ffffff', '#e2d1f9'];
        const container = document.getElementById("confetti-container");
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement("div");
            confetti.style.position = 'absolute';
            confetti.style.width = '12px';
            confetti.style.height = '12px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            container.appendChild(confetti);
            
            const animationDuration = Math.random() * 4 + 3;
            confetti.animate([
                { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
                { transform: `translate3d(${Math.random()*200 - 100}px, 100vh, 0) rotate(${Math.random()*720}deg)`, opacity: 0 }
            ], {
                duration: animationDuration * 1000,
                easing: 'ease-in-out',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                confetti.remove();
            }, animationDuration * 1000);
        }
    }

    // --- Utility: Sparkle & Butterfly Engine ---
    function spawnSparkle() {
        const container = document.getElementById("sparkles-container");
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.top = Math.random() * 100 + "vh";
        
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3000);
    }

    function spawnButterfly() {
        const container = document.getElementById("butterflies-container");
        const butterfly = document.createElement("div");
        butterfly.className = "butterfly";
        butterfly.style.top = (Math.random() * 60 + 20) + "vh"; // Start somewhere in middle 60%
        
        container.appendChild(butterfly);
        setTimeout(() => butterfly.remove(), 15000);
    }
    
    // Periodically spawn ambient particles
    setInterval(spawnSparkle, 500);
    setInterval(spawnButterfly, 8000);
    
    // Initial spawns
    for(let i=0; i<15; i++) spawnSparkle();
    spawnButterfly();
});
