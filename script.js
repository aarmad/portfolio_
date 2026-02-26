// =============================================
// PORTFOLIO — Aaron Madjri | script.js
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    // ─── Navigation sticky shadow ───────────────
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        window.addEventListener('scroll', () => {
            navBar.style.boxShadow = window.scrollY > 80
                ? '0 8px 30px rgba(0,0,0,0.08)'
                : 'none';
        });
    }

    // ─── VIVUS SVG Animations ────────────────────
    // Vivus draws SVG paths on load — each inline SVG gets its stroke-dash animated
    // We collect all distinct <svg> elements and give them unique IDs if needed
    animateSVGsWithVivus();

    // ─── Scroll reveal ──────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.section-card, .project-brutalist, .timeline-entry, .contact-card, .skill-item'
    ).forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
        el.classList.add('reveal-target');
        revealObserver.observe(el);
    });

    // Add is-visible CSS rule dynamically
    const style = document.createElement('style');
    style.textContent = '.reveal-target.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // ─── Smooth scroll ──────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const navLink = document.querySelector(`.nav-link[href="${this.getAttribute('href')}"]`);
                if (navLink) navLink.classList.add('active');
            }
        });
    });

    // ─── Contact form ───────────────────────────
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            const btn = this.querySelector('button[type="submit"]');
            const orig = btn.innerText;
            btn.innerText = 'Redirection WhatsApp…';
            btn.disabled = true;

            // Construct WhatsApp message
            const fullMessage = `Bonjour Aaron, je m'appelle ${name} (${email}). Voici mon message : ${message}`;
            const whatsappUrl = `https://wa.me/33767020615?text=${encodeURIComponent(fullMessage)}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                btn.innerText = 'Message envoyé ✓';
                btn.classList.add('btn-success');
                this.reset();
                setTimeout(() => {
                    btn.innerText = orig;
                    btn.disabled = false;
                    btn.classList.remove('btn-success');
                }, 3000);
            }, 800);
        });
    }

    // ─── THREE.JS AVATAR ─────────────────────────
    const canvas = document.getElementById('avatarCanvas');
    if (canvas && typeof THREE !== 'undefined') {
        initAvatar3D(canvas);
    }
});

// ─────────────────────────────────────────────
// VIVUS — Animate every inline SVG on page load
// Uses the Vivus library loaded via CDN
// ─────────────────────────────────────────────
function animateSVGsWithVivus() {
    if (typeof Vivus === 'undefined') return;

    // Select all inline SVGs that have visible strokes
    const svgs = document.querySelectorAll('svg');
    let counter = 0;

    svgs.forEach(svg => {
        // Skip SVGs with no stroke paths or filled SVGs (e.g. decorative)
        const hasStroke = svg.querySelector('[stroke]:not([stroke="none"])');
        if (!hasStroke) return;

        // Give the SVG a unique ID if it doesn't have one
        if (!svg.id) {
            svg.id = `vivus-svg-${counter++}`;
        }

        // Make sure all stroke elements have fill:none so the draw effect is visible
        svg.querySelectorAll('path, circle, line, polyline, ellipse, rect').forEach(el => {
            if (!el.getAttribute('fill') || el.getAttribute('fill') === 'none') {
                el.setAttribute('fill', 'none');
            }
        });

        // Random delay for natural staggered effect
        const delay = Math.random() * 60;

        try {
            new Vivus(svg.id, {
                type: 'delayed',
                duration: 150,
                start: 'autostart',
                animTimingFunction: Vivus.EASE_OUT,
                delay: delay
            });
        } catch (_) { }
    });
}

// ─────────────────────────────────────────────
// THREE.JS : Avatar 3D basé sur le favicon
// Sphère visage + lunettes or + particules
// ─────────────────────────────────────────────
function initAvatar3D(canvas) {
    const container = canvas.parentElement;
    const W = container.clientWidth || 400;
    const H = container.clientHeight || 400;

    // ── Renderer ──────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x0f0f0f, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── Scene ─────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f0f0f, 8, 22);

    // ── Camera ────────────────────────────
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 6.5);
    camera.lookAt(0, 0, 0);

    // ── Lights ────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    keyLight.position.set(3, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xFFD700, 2, 14);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    // ── Root group (all face parts move together) ──
    const faceGroup = new THREE.Group();
    scene.add(faceGroup);

    // ── Face sphere ──────────────────────
    const faceMat = new THREE.MeshStandardMaterial({
        color: 0x3B1F0E,
        roughness: 0.65,
        metalness: 0.0
    });
    const faceMesh = new THREE.Mesh(new THREE.SphereGeometry(1.3, 64, 64), faceMat);
    faceMesh.castShadow = true;
    faceGroup.add(faceMesh);

    // ── Ears ─────────────────────────────
    const earGeo = new THREE.SphereGeometry(0.22, 24, 24);
    [-1, 1].forEach(side => {
        const ear = new THREE.Mesh(earGeo, faceMat);
        ear.position.set(side * 1.46, 0, 0);
        faceGroup.add(ear);
    });

    // ── Eye helper ───────────────────────
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });

    function makeEye(x, isLeft) {
        const group = new THREE.Group();
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5 });

        // Horizontal lines forming the '>' or '<'
        const barLength = 0.28;
        const barWidth = 0.04;
        const barGeo = new THREE.CylinderGeometry(barWidth, barWidth, barLength, 8);

        const topBar = new THREE.Mesh(barGeo, eyeMat);
        const bottomBar = new THREE.Mesh(barGeo, eyeMat);

        const angle = isLeft ? Math.PI / 4 : -Math.PI / 4;

        topBar.rotation.z = angle;
        topBar.position.y = 0.08;

        bottomBar.rotation.z = -angle;
        bottomBar.position.y = -0.08;

        group.add(topBar, bottomBar);
        group.position.set(x, 0.22, 1.32);
        return group;
    }
    const leftEye = makeEye(-0.44, true); // >
    const rightEye = makeEye(0.44, false); // <
    faceGroup.add(leftEye, rightEye);

    // ── Glasses frames (golden rings using TorusGeometry) ──
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        roughness: 0.08,
        metalness: 0.95
    });

    function makeGlassRing(x) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.42, 0.05, 16, 64),
            glassMat
        );
        ring.position.set(x, 0.22, 1.45);
        return ring;
    }

    const leftLens = makeGlassRing(-0.53);
    const rightLens = makeGlassRing(0.53);
    faceGroup.add(leftLens, rightLens);

    // Bridge between glasses (cylinder)
    const bridgeMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12),
        glassMat
    );
    bridgeMesh.rotation.z = Math.PI / 2;
    bridgeMesh.position.set(0, 0.22, 1.45);
    faceGroup.add(bridgeMesh);

    // ── Mouth (flat line "___") ───────────
    const mouthGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8);
    const mouthMesh = new THREE.Mesh(mouthGeo,
        new THREE.MeshStandardMaterial({ color: 0x1a0000 }));
    mouthMesh.rotation.z = Math.PI / 2;
    mouthMesh.position.set(0, -0.6, 1.25);
    faceGroup.add(mouthMesh);

    // ── Particle cloud ────────────────────
    const partCount = 300;
    const partPositions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i++) {
        partPositions[i] = (Math.random() - 0.5) * 10;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
        color: 0x4488ff,
        size: 0.035,
        transparent: true,
        opacity: 0.55
    });
    scene.add(new THREE.Points(partGeo, partMat));

    // ── Ground glow plane ─────────────────
    const glowGeo = new THREE.CircleGeometry(2.5, 48);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x0022aa,
        transparent: true,
        opacity: 0.15
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.rotation.x = -Math.PI / 2;
    glowMesh.position.y = -1.8;
    scene.add(glowMesh);

    // ── Mouse tracking ────────────────────
    let targetRotX = 0;
    let targetRotY = 0;

    container.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        targetRotY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.7;
        targetRotX = -((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    });

    container.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
    });

    // ── Animate ───────────────────────────
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse follow
        faceGroup.rotation.y += (targetRotY - faceGroup.rotation.y) * 0.07;
        faceGroup.rotation.x += (targetRotX - faceGroup.rotation.x) * 0.07;

        // Gentle breathing bob
        faceGroup.position.y = Math.sin(time * 0.9) * 0.07;

        // Rim light orbit
        rimLight.position.x = Math.cos(time * 0.35) * 3.5;
        rimLight.position.z = Math.sin(time * 0.35) * 3.5 - 1;

        // Glasses glint
        const glintIntensity = (Math.sin(time * 2) * 0.5 + 0.5) * 0.5 + 0.5;
        glassMat.emissive = new THREE.Color(0xFFD700);
        glassMat.emissiveIntensity = glintIntensity * 0.15;

        renderer.render(scene, camera);
    }
    animate();

    // ── Resize handler ────────────────────
    const ro = new ResizeObserver(() => {
        const nW = container.clientWidth;
        const nH = container.clientHeight;
        if (nW === 0 || nH === 0) return;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
    });
    ro.observe(container);
}