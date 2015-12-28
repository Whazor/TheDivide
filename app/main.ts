class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.moveTo(0,0);
    this.ctx.lineTo(200,100);
    this.ctx.stroke();
  }
  click() {

  }
}


$(function(){
  new Game();
});
