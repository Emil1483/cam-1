export class Point {
    applyForce(force) {
        this.vel.add(force);
    }
    update() {
        this.pos.add(this.vel);
    }
    show() {
        fill(255);
        circle(this.pos.x, this.pos.y, 10);
    }
}
