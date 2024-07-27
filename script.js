document.addEventListener('DOMContentLoaded', function() {
    const modoNoturnoIcon = document.getElementById('modo-noturno');
    const overlay = document.getElementById('overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const centralButton = document.querySelector('.central-button');
    const interactiveObjectsContainer = document.createElement('div');
    overlay.appendChild(interactiveObjectsContainer);
    interactiveObjectsContainer.id = 'interactive-objects';
    let interactiveObjects = [];

    const lightParticlesConfig = {
        particles: {
            number: { value: 90 },
            color: { value: '#000000' },
            shape: { type: 'circle' },
            opacity: { value: 1, random: true },
            size: { value: 1.5 },
            line_linked: { enable: false, color: '#000000' },
            move: { enable: true, speed: 0.6 }
        }
    };

    const darkParticlesConfig = {
        particles: {
            number: { value: 90 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 1, random: true },
            size: { value: 1.5 },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 0.6 }
        }
    };

    const leafParticlesConfig = {
        particles: {
            number: { value: 100 },
            color: { value: '#00ff00' },
            shape: { type: 'image', image: { src: 'folha.png', width: 100, height: 100 } },
            opacity: { value: 1, random: true },
            size: { value: 15, random: true },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 1.5, direction: 'bottom' }
        }
    };

    const starParticlesConfig = {
        particles: {
            number: { value: 100 },
            color: { value: '#ffffff' },
            shape: { type: 'image', image: { src: 'star.png', width: 100, height: 100 } },
            opacity: { value: 0.7, random: true },
            size: { value: 6, random: true },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 0.2 }
        }
    };

    const loadParticlesConfig = (isNightMode) => {
        const config = isNightMode ? darkParticlesConfig : lightParticlesConfig;
        particlesJS('particles-js', config);
    };

    const loadMainParticlesConfig = (isNightMode) => {
        const config = isNightMode ? starParticlesConfig : leafParticlesConfig;
        particlesJS('particles-main', config);
    };

    const createInteractiveObject = (id, src, x, y, isCentral = false) => {
        const obj = document.createElement('div');
        obj.classList.add('interactive-object');
        if (isCentral) {
            obj.classList.add('central-object');
        }
        obj.style.left = `${x}px`;
        obj.style.top = `${y}px`;

        const img = document.createElement('img');
        img.src = src;
        img.alt = `object-${id}`;


        obj.appendChild(img);
        interactiveObjectsContainer.appendChild(obj);

        let startX, startY, initialX, initialY;

        const onDragStart = (event) => {
            startX = event.clientX;
            startY = event.clientY;
            initialX = obj.offsetLeft;
            initialY = obj.offsetTop;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onDragEnd);
        };

        const onDrag = (event) => {
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            obj.style.left = `${initialX + dx}px`;
            obj.style.top = `${initialY + dy}px`;
        };

        const onDragEnd = () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onDragEnd);
        };

        obj.addEventListener('mousedown', onDragStart);
        return obj;
    };

    const initializeInteractiveObjects = () => {
        const centralPosition = getCentralPosition();
        const surroundingPositions = [
            { angle: 45, distance: 200 },
            { angle: 90, distance: 200 },
            { angle: 135, distance: 200 },
            { angle: 180, distance: 200 },
            { angle: 225, distance: 200 },
            { angle: 270, distance: 200 },
            { angle: 315, distance: 200 },
            { angle: 360, distance: 200 },
        ];
        const srcs = [
            'botao/usina.png', 'botao/atomic.png', 'botao/arvore.png', 
            'botao/agua.png', 'botao/carro.png', 'botao/company.png', 
            'botao/economia.png', 'botao/industrial.png', 'botao/sol.png'
        ];

        const centralObject = createInteractiveObject(0, srcs[0], centralPosition.x, centralPosition.y, true);
        interactiveObjects.push(centralObject);

        surroundingPositions.forEach((pos, index) => {
            const angleInRadians = pos.angle * (Math.PI / 180);
            const x = centralPosition.x + pos.distance * Math.cos(angleInRadians);
            const y = centralPosition.y + pos.distance * Math.sin(angleInRadians);
            const obj = createInteractiveObject(index + 1, srcs[index + 1], x, y);
            interactiveObjects.push(obj);
        });
    };

    overlay.style.display = 'none';

    modoNoturnoIcon.addEventListener('click', function() {
        document.body.classList.toggle('modo-noturno');
        const isNightMode = document.body.classList.contains('modo-noturno');
        modoNoturnoIcon.src = isNightMode ? 'icone_sol.png' : 'icone_lua.png';
        loadParticlesConfig(isNightMode);
        loadMainParticlesConfig(isNightMode);
    });

    centralButton.addEventListener('click', function() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        loadParticlesConfig(document.body.classList.contains('modo-noturno'));
    });

    closeOverlay.addEventListener('click', function() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    window.addEventListener('scroll', function() {
        const footer = document.querySelector('footer');
        footer.style.bottom = (window.scrollY + window.innerHeight >= document.body.offsetHeight) ? '0' : '-150px';
    });

    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });

    initializeInteractiveObjects();
    loadMainParticlesConfig(document.body.classList.contains('modo-noturno'));
});

window.addEventListener('resize', () => {
    const centralPosition = getCentralPosition();
    console.log(`Posição central atualizada: x = ${centralPosition.x}, y = ${centralPosition.y}`);
});

function getCentralPosition() {
    const overlay = document.getElementById('overlay');
    const centerX = overlay.offsetWidth / 2 - 35; // Subtract half of the object's width (70px / 2)
    const centerY = overlay.offsetHeight / 2 - 35; // Subtract half of the object's height (70px / 2)
    return { x: centerX, y: centerY };
}
