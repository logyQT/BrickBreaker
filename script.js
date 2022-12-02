"use stict";

import { Ball } from "../src/Ball.js";
import { Paddle } from "../src/Paddle.js";
import { Brick } from "./src/Brick.js";

const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const checkCollision = (circle, rect) => {
    const closestX = clamp(circle.x, rect.left, rect.right);
    const closestY = clamp(circle.y, rect.top, rect.bottom);
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    return distanceSquared < circle.r * circle.r;
};

const clamp = (value, min, max) => {
    return value < min ? min : value > max ? max : value;
};

const canvas = document.querySelector("#game-window");
canvas.width = 3840;
canvas.height = 2160;

const hue = randomNumberBetween(0, 360);

const ctx = canvas.getContext("2d");

const ball = new Ball(ctx, canvas.height, canvas.width, hue, { bottom: false });
const player = new Paddle(ctx, canvas.height, canvas.width, canvas.height / 90, canvas.height / 10);
let PLAYER_LEFT = false;
let PLAYER_RIGHT = false;

const BRICK_HEIGHT = canvas.height / 50;
const BIRCK_WIDTH = BRICK_HEIGHT * 5;

const BRICK_COUNT_X = 17;
const BRICK_COUNT_Y = 10;
const BRICK_GAP = 5;

let bricks = [];

for (let i = 0; i < BRICK_COUNT_X; i++) {
    for (let j = 0; j < BRICK_COUNT_Y; j++) {
        //prettier-ignore
        bricks.push(new Brick(
            ctx, 
            canvas.height, 
            canvas.width, 
            BRICK_HEIGHT, 
            BIRCK_WIDTH, 
            BIRCK_WIDTH * i + BRICK_GAP * i + (canvas.width-(BIRCK_WIDTH*BRICK_COUNT_X)-(BRICK_GAP*(BRICK_COUNT_X-1)))/2, 
            BRICK_HEIGHT * j + BRICK_GAP * j + (canvas.width-(BIRCK_WIDTH*BRICK_COUNT_X)-(BRICK_GAP*(BRICK_COUNT_X-1)))/2,
            j,
            i,
            hue
            ));
    }
}

let last_time;
const update = (time) => {
    if (last_time != null) {
        const delta = time - last_time;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.update(delta, player, bricks);

        if (PLAYER_LEFT) player.update(delta, -canvas.width / 2000);
        if (PLAYER_RIGHT) player.update(delta, canvas.width / 2000);

        const outOfBoundsBottom = ball.y - ball.r >= canvas.height;

        if (outOfBoundsBottom) {
            ball.reset();
        }

        let colides_with_brick = false;
        let brick_id;

        for (let i = 0; i < bricks.length; i++) {
            if (ball.y - BRICK_HEIGHT - ball.r >= bricks[i].y) continue;
            if (bricks[i].colisions) continue;
            if (checkCollision(ball, bricks[i])) {
                bricks[i].remove();
                ball.direction.y *= -1;
            }
        }

        bricks.forEach((brick) => {
            brick.draw();
        });

        ball.draw();
        player.draw();
    }
    last_time = time;
    window.requestAnimationFrame(update);
};

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key == "a" || key == "arrowleft") {
        PLAYER_LEFT = true;
    } else if (key == "d" || key == "arrowright") {
        PLAYER_RIGHT = true;
    }
});

document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (key == "a" || key == "arrowleft") {
        PLAYER_LEFT = false;
    } else if (key == "d" || key == "arrowright") {
        PLAYER_RIGHT = false;
    }
});

window.requestAnimationFrame(update);
