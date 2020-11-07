export class Firework extends Point {
    constructor() {
        super();
        this.pos = createVector(random(width), height);
        this.vel = createVector(0, -10);
    }
    update() {
        this.applyForce(createVector(0, 1));
        super.update();
    }
}
