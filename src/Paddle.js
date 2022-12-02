export class Paddle {
    constructor(ctx, window_height, window_width, height, width) {
        this.ctx = ctx;
        this.game_height = window_height;
        this.game_width = window_width;
        this.height = height;
        this.width = width;
        this.y = this.game_height - 10 - this.height;
        this.reset();
    }
    reset() {
        this.x = this.game_width / 2 - this.width / 2;
        this.calculateBoundingBox();
    }
    calculateBoundingBox() {
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;
    }
    draw() {
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update(delta = null, distance) {
        this.x += distance * delta;
        this.calculateBoundingBox();
        this.outOfBounds();
        this.calculateBoundingBox();
    }
    outOfBounds() {
        if (this.left < 0) {
            this.x = 0;
        } else if (this.right > this.game_width) {
            this.x = this.game_width - this.width;
        }
    }
}
