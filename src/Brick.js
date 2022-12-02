const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export class Brick {
    constructor(ctx, window_height, window_width, height, width, x, y, row, col, hue) {
        this.ctx = ctx;
        this.game_height = window_height;
        this.game_width = window_width;
        this.height = height;
        this.width = width;
        this.INIT_X = x;
        this.INIT_Y = y;
        this.color = `hsl(${hue},${row * 10 + 30}%,50%)`;
        this.reset();
    }
    reset() {
        this.collisions = true;
        this.x = this.INIT_X;
        this.y = this.INIT_Y;
        this.calculateBoundingBox();
    }
    calculateBoundingBox() {
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    remove() {
        this.x = this.game_width + 1000;
        this.y = this.game_height + 1000;
        this.calculateBoundingBox();
        this.collisions = false;
    }
}
