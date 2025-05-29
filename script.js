const bodyElement = document.body;
const canvasElement = document.getElementsByTagName('canvas')[0];
const ctx = canvasElement.getContext('2d');

window.requestAnimFrame = (function() {
    return window.requestAnimFrame ||
           window.webkitRequestAnimationFrame ||
           function(callback) {
                window.setTimeout(callback, 1000 / 60);
           };
})();

let mouseX = 0;
let mouseY = 0;

bodyElement.addEventlistener('mousemove', function(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

bodyElement.addEventListener('click', function(event) {
    particles.forEach(particle => {
         particle.x = mouseX;
         particle.y = mouseY;
    });
});

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const particleSizeFactor = Math.floor((canvasWidth * canvasHeight) / 29000);
const numParticles = 900;
const particles = [];

canvasElement.width = canvasWidth;
canvasElement.height = canvasHeight;

function initializeParticles() {
    for (let i = 0; i < numParticles; i++) {
        const particle = {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            angelcontrolA: Math.random() * 100000,
            angelcontrolB: 0,
            previousHeartState: 0,
            opacity: 0.1,
        };
        particle.angelcontrolB = particle.angelcontrolA;
        particles.push(particle);
    }
}

let heartPixelDate = null;

function captureHeartShape() {
    ctx.fillstyle = "rgba(0, 0, 0, 1)";
    ctx.font = (canvasWidth * 0.8) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaselinen = "middle";
    ctx.fillText('💛', canvasWidth / 2, canvasHeight / 2);

    try {
        heartPixelDate = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    } catch (e) {
        console.error("could not get image data:", e);
        return;
    }

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function render() {
    if (!heartPixelData) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach(particle => {
        particle.angelcontrolA += Math.random() > 0.5 ? -1 : 1;
        particle.angelcontrolB -= (particle.angelcontrolB - particle.angelcontrolA)
    
        const angle = particle.angelcontrolB *8;
        const radianAngle = angle * Math.PI / 100;
        particle.x += Math.cos(radianAngle);
        particle.y += Math.sin(radianAngle);

        const px = Math.floor(particle.x);
        const py = Math.floor(particle.y);

        let currentHeartValue = 0;
        if (px >= 0 && px < canvasWidth && py >= 0 && py < canvasHeigt) {
            const pixelIndex = (px + (py * canvasWidth)) * 4;
            currentHeartValue = heartPixelDate[PixelIndex + 3];
        }

        const isTnHeart = currentHeartValue > 0;

        if ((isTnHeart && !particle.previousHeartState) || (!isTnHeart && particle.previousHeartState)) {
            particle.opacity = 0.05;
    }

    particle.previousHeartState = isTnHeart;

    if(isTnHeart) {
        particle.opacity += particle.opacity < 0.8 ? 0.03 : 0;
        ctx.fillStyle = `rgba(255, 0, 0, ${particle.opacity})`;
    } else {
        particle.opacity += particle.opacity < 0.8 ? 0.01 : 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    }

    const wrapBuffer = particleSizeFactor;
    if (particle.x > canvasWidth + wrapBuffer) particle.x = -wrapBuffer;
    if (particle.x < -wrapBuffer) particle.x = canvasWidth + wrapBuffer;
    if (particle.y > canvasHeight + wrapBuffer) particle.y = -wrapBuffer;
    if (particle.y < -wrapBuffer) particle.y = canvasHeight + wrapBuffer;

    const deltaX = particle.x - canvasWidth / 2;
    const deltaY = particle.y - canvasHeight / 2;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const fontSizeBase = particleSizeFactor;
    const dynamicFontSize = (distance < fontSizeBase * (fontSizeBase / 4 ) ? Math.floor(distance / (fontSizeBase / 4 )) || 1 : fontSizeBase);
    const finalFontSize = Math.max(1, dynamicFontSize);
    ctx.font = finalFontSize + 'px Arial'

    ctx.fillText('❤', Math.floor(particle.x), Math.floor(particle.y));
    });
}

(function animationLoop() {
    requestAnimFrame(animationLoop);
    render();
})();

initializeParticles();
captureHeartShape();


