module TD {
  export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor() {
      this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.draw();
      this.canvas.onclick = function(e) {
        this.click(e);
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var time = new Date();

      this.ctx.moveTo(0,0);
      this.ctx.lineTo(200,100);
      this.ctx.stroke();

      // window.requestAnimationFrame(this.draw);
    }
    click(e: MouseEvent) {

      this.draw();
    }
  }
}

$(function(){
  new TD.Game();
});
