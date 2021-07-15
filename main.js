const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext('2d'); 
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 

let particlesArray =[]; 
let collisionParticles = []; 
let hue = 0; 

// measure title element 
let titleElement = document.getElementById('title1'); 
let titleMeasure = titleElement.getBoundingClientRect(); 
let title = { 
    x: titleMeasure.left,
    y: titleMeasure.top,
    width: titleMeasure.width,
    height: 10 
}


// get click position \
const mouse = { 
    x : undefined, 
    y : undefined
}
window.addEventListener('click', function(event) { 
    mouse.x = event.x; 
    mouse.y = event.y; 
    for (let i=0; i<1; i++) { 

        particlesArray.push(new Particle(mouse.x, mouse.y, Math.random() * 30 + 5,'hsl('+hue+',100%,50%)')); 
    }
    // console.log(particlesArray); 
})

class Particle { 
    constructor(x,y,sizeBall,color) { 
        this.x = x; 
        this.y = y; 
        // this.size = Math.random() * 30 + 5; 
        this.size = sizeBall; 
        // this.color = 'hsl('+hue+',100%,50%)'; 
        this.color = color; 
        this.weight = Math.random() * 4 + 1; 
        this.directionX = Math.random() * 5 - 1.5; 
        this.speedX = Math.random() * 3 - 1.5; 
        this.speedY = (Math.random() * this.speedX-1) - this.speedX; 
    }
    update() { 
       
        this.weight+=0.05;
        this.y += this.weight; 
        this.x +=this.directionX; 

        // check for collision
        if(
            this.x < title.x + title.width + 40 &&
            this.x + this.size > title.x - 40 &&
            this.y < title.y + title.height &&
            this.y + this.size > title.y
        ) { 
            for (let i=0; i<3; i++) { 
                collisionParticles.push(new Particle(this.x, this.y+10,10, this.color)); 
            }
            //handleCollision();
            this.y -= 5; 
            this.weight *= -0.7; 
        }

    }

    updateCollision() { 
        this.x += this.speedX; 
        this.y += this.speedY; 
        if ( this.size >3) this.size -= 0.3; 
    }

    draw() { 
        ctx.fillStyle = this.color; 
        ctx.beginPath() ; 
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI); 
        ctx.closePath() ; 
        ctx.fill()
    }
}

// function init() { 
//     for(let i=0;i<numberParticle; i++) { 
//         let x = Math.random() * canvas.width; 
//         let y = Math.random() * title.y; 
//         particlesArray.push(new Particle(x,y)); 
//     }
//     // console.log(particlesArray); 
// }

// init();

function handleParticles() { 
    for(let i=0; i<particlesArray.length; i++) { 
        particlesArray[i].update(); 
        particlesArray[i].draw(); 
        if(particlesArray[i].y > canvas.height) {
            particlesArray.splice(i,1); 
            i--; 
        }
    }

}

function handleCollision() { 
    for (let i=0; i<collisionParticles.length;i++) { 
        collisionParticles[i].updateCollision(); 
        collisionParticles[i].draw(); 
        
        for(let j=i; j<collisionParticles.length; j++) { 
            let dx = collisionParticles[i].x - collisionParticles[j].x;
            let dy = collisionParticles[i].y - collisionParticles[j].y; 
            let distance = Math.sqrt(dx*dx + dy*dy); 

            if (distance<100) { 
                ctx.beginPath(); 
                ctx.strokeStyle = collisionParticles[i].color; 
                ctx.lineWidth = collisionParticles[i].size/10; 
                ctx.moveTo(collisionParticles[i].x, collisionParticles[i].y); 
                ctx.lineTo(collisionParticles[j].x,collisionParticles[j].y); 
                ctx.stroke(); 
                ctx.fill(); 
            }
        }
        if(collisionParticles[i].y < 0 || collisionParticles[i].x<0) {
            collisionParticles.splice(i,1); 
            i--; 
        }
    }
    
}

function animate() { 
    ctx.clearRect(0, 0, canvas.width,canvas.height); 
    // ctx.fillStyle = 'rgba(255,255,255,0.01)'; 
    // ctx.fillRect(0, 0, canvas.width,canvas.height); 
    handleParticles(); 
    handleCollision(); 
    ctx.fillStyle = 'white'; 
    ctx.fillRect(title.x-40, title.y,title.width+80, title.height); 
    hue+=0.7
    requestAnimationFrame(animate); 
}

animate(); 

