import { Firework } from "./firework";
const points = [];
function setup() {
    console.log("hello");
    createCanvas(displayWidth, displayHeight);
}
function draw() {
    background(0);
}
function mouseClicked() {
    console.log(1);
    points.push(new Firework());
}
