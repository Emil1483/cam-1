let video;
let classifier;
let label = null;
let images = {};
const g = 0.7;
let v0;
const countdownStart = 20;
let countdown = countdownStart;
const points = [];
function preload() {
    classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/fPFygd0C8/model.json');
    images.Question = loadImage('../assets/Question.png');
    images.Nervous = loadImage('../assets/Nervous.png');
    images.Gone = loadImage('../assets/Gone.png');
}
function setup() {
    createCanvas(displayWidth, displayHeight);
    video = createCapture(VIDEO);
    video.hide();
    classifier.classify(video, gotResults);
    v0 = sqrt(g * height * 4 / 3);
    classifier.classify(video, gotResults);
}
let pResult;
function gotResults(error, results) {
    if (error) {
        console.log(error);
        return;
    }
    const result = results[0].label;
    if (result == pResult) {
        countdown--;
    }
    else {
        countdown = countdownStart;
    }
    if (countdown == 0)
        label = result;
    pResult = result;
    classifier.classify(video, gotResults);
}
function draw() {
    image(video, 0, 0, width, height);
    const img = images[label];
    if (img)
        image(img, 0, 0);
    if (label == 'Heart' && random(1) > 0.95)
        points.push(new Firework());
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        point.update();
        if (point.isDead) {
            points.splice(i, 1);
        }
    }
    points.forEach(point => point.show());
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
        const r = this.vel.mag();
        const a = this.vel.heading();
        push();
        translate(this.pos.x, this.pos.y);
        rotate(a);
        ellipse(0, 0, r * 2 + 10, 10);
        pop();
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
        this.pos = createVector(random(width), height);
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
