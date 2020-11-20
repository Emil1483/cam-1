import { Vector } from "p5";

let video: any;
let classifier: any;
type LabelType = 'Background' | 'Question' | 'Nervous' | 'Heart' | 'Gone' | null;
let label: LabelType = null;

let images: any = {};

const g = 0.7;
let v0: number;

const countdownStart = 20;
let countdown = countdownStart;

const points: Point[] = [];

function preload() {
    classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/q2RHRZx8I/model.json');

    images.Question = loadImage('../assets/Question.png');
    images.Nervous = loadImage('../assets/Nervous.png');
    images.Gone = loadImage('../assets/Gone.png');
}

function setup() {
    createCanvas(displayWidth, displayHeight);
    video = createCapture(VIDEO);

    video.hide();

    v0 = sqrt(g * height * 4 / 3)

    updateLabel();
}

let pResult: LabelType;
function gotResults(error: any, results: { label: string, confidence: number }[]) {
    if (error) {
        console.log(error);
        return;
    }

    const result = results[0].label as LabelType;
    if (result == pResult) {
        countdown--;
    } else {
        countdown = countdownStart;
    }
    if (countdown == 0) label = result;

    pResult = result;

    updateLabel();
}

function updateLabel() {
    const size = video.height - 120;
    const cropped = video.get((video.width - size) / 2, 60, size, size)
    classifier.classify(cropped, gotResults);
}

function draw() {
    background(0, 0, 255);

    const img = images[label];
    if (img) image(img, 0, 0);

    if (label == 'Heart' && random(1) > 0.95) points.push(new Firework());

    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        point.update();
        if (point.isDead) {
            points.splice(i, 1);
        }
    }

    points.forEach(point => point.show());
}

abstract class Point {
    pos: Vector;
    vel: Vector;

    applyForce(force: Vector): void {
        this.vel.add(force);
    }

    update(): void {
        this.vel.add(createVector(0, g));
        this.pos.add(this.vel);
    }

    show(): void {
        fill(255, 0, 0);
        noStroke();

        const r = this.vel.mag();
        const a = this.vel.heading();

        push();
        translate(this.pos.x, this.pos.y);
        rotate(a)
        ellipse(0, 0, r * 2 + 10, 10);
        pop();
    }

    get isDead(): boolean {
        return this.pos.y > height;
    }
}

class Particle extends Point {
    constructor(pos: Vector, vel: Vector) {
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

    get isDead(): boolean {
        if (this.vel.y >= 0) {
            for (let a = 0; a < TWO_PI; a += TWO_PI / 50) {
                points.push(new Particle(
                    this.pos.copy(),
                    heart(a).mult(0.5),
                ));
            }
            return true;
        }
        return false;
    }
}

function heart(t: number): Vector {
    const x = - 16 * pow(sin(t), 3);
    const y = - 13 * cos(t)
        + 5 * cos(2 * t) + 2 * cos(3 * t) + cos(4 * t);
    return createVector(x, y - 10);
}