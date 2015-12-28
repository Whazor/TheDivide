module TD {
  export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    things: Array<Position&BoundingBox&Draw> = [];

    constructor() {
      this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

      var soldier = new TD.Soldier()

      this.things.push(soldier);


      this.draw();
      // this.canvas.onclick = function(e) {
      //   this.click(e);
      // }
    }

    draw() {
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


      // this.ctx.moveTo(0,0);
      // this.ctx.lineTo(200,100);
      // this.ctx.stroke();
      var soldier = new TD.Soldier()
      soldier.draw(this.ctx);

      // draw all the things
      for (let i = 0; i < this.things.length; i++) {
          var thing = this.things[i];
          thing.draw(this.ctx);
      }
    }
    click(e: MouseEvent) {

      // this.draw();
    }
  }
}


var interval;
var loadBar = function() {
  var images = document.getElementsByClassName('image');
  var yes = 0;
  var no = 0;
  for (let i = 0; i < images.length; i++) {
    var image = <HTMLImageElement>images[i];
    var isLoaded = image.naturalWidth > 0;
    if (isLoaded) {
      yes++;
    } else {
      no++;
    }
  }
  if(no === 0) {
    $("#loadscreen").remove();
    clearInterval(interval);
    new TD.Game();
  } else {
    var total = (yes+no);
    var percentage = yes/total * 100;
    $("#bar").css('width', percentage+'%');
  }
}
interval = setInterval(function(){
  loadBar();
}, 100);
