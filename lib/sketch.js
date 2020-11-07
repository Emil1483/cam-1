const g = 0.7;
let v0;
const points = [];
function setup() {
    createCanvas(displayWidth, displayHeight);
    v0 = sqrt(g * height * 4 / 3);
}
function draw() {
    background(0, 255, 0);
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        point.update();
        if (point.isDead) {
            points.splice(i, 1);
        }
    }
    points.forEach(point => point.show());
}
function mousePressed() {
    points.push(new Firework());
}
class Point {
    applyForce(force) {
        this.vel.add(force);
    }
    update() {
        this.vel.add(createVector(0, g));
        this.pos.add(this.vel);
    }
    show() {
        fill(255, 0, 0);
        noStroke();
        circle(this.pos.x, this.pos.y, 20);
    }
    get isDead() {
        return this.pos.y > height;
    }
}
class Particle extends Point {
    constructor(pos, vel) {
        super();
        this.pos = pos;
        this.vel = vel;
    }
}
class Firework extends Point {
    constructor() {
        super();
        this.pos = createVector(mouseX, height);
        this.vel = createVector(0, -v0);
    }
    get isDead() {
        if (this.vel.y >= 0) {
            for (let a = 0; a < TWO_PI; a += TWO_PI / 50) {
                points.push(new Particle(this.pos.copy(), heart(a).mult(0.5)));
            }
            return true;
        }
        return false;
    }
}
function heart(t) {
    const x = -16 * pow(sin(t), 3);
    const y = -13 * cos(t)
        + 5 * cos(2 * t) + 2 * cos(3 * t) + cos(4 * t);
    return createVector(x, y - 10);
}
