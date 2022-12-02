const TWO_PI = Math.PI * 2;

export class Ball {
    constructor(ctx, height, width, hue, { ...args }) {
        this.ctx = ctx;
        this.game_height = height;
        this.game_width = width;

        // prettier-ignore
        this.coliders = { 
            left: args.hasOwnProperty("left") ? args.left : true,
            top: args.hasOwnProperty("top") ? args.top : true,
            right: args.hasOwnProperty("right") ? args.right : true,
            bottom: args.hasOwnProperty("bottom") ? args.bottom : true,
        };

        this.INITIAL_VELOCITY = 0.5;
        this.VELOCITY_INCREASE = 0;

        this.color = `hsl(${hue}, 50%, 50%)`;
        this.reset();
    }
    reset() {
        this.x = this.game_width / 2;
        this.y = this.game_height - 100;
        this.r = this.game_height / 100;
        this.direction = { x: 0, y: 0 };
        while (Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9) {
            const heading = randomNumberBetween(0, TWO_PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
        this.velocity = this.INITIAL_VELOCITY;
        this.CAN_COLIDE_WITH_PLAYER = true;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, TWO_PI);
        this.ctx.fill();
    }
    update(delta, player_paddle) {
        this.x += this.velocity * this.direction.x * delta;
        this.y += this.velocity * this.direction.y * delta;
        this.velocity += this.VELOCITY_INCREASE;
        this.CAN_COLIDE_WITH_PLAYER = true;
        const colides_with_player = checkCollision(this, player_paddle);
        if (colides_with_player && this.CAN_COLIDE_WITH_PLAYER) {
            this.direction.y *= -1;
            this.CAN_COLIDE_WITH_PLAYER = false;
        }
        if (this.y - this.r <= 0 && this.coliders.top) {
            this.direction.y *= -1;
        } else if (this.y + this.r >= this.game_height && this.coliders.bottom) {
            this.direction.y *= -1;
        } else if (this.x - this.r <= 0 && this.coliders.left) {
            this.direction.x *= -1;
        } else if (this.x + this.r >= this.game_width && this.coliders.right) {
            this.direction.x *= -1;
        }
    }
}

const randomNumberBetween = (min, max) => {
    return Math.random() * (max - min) + min;
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
