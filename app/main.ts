module TD {
  export var width: number;
  export var height: number;

  export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    things: Array<Position&BoundingBox&Draw> = [];
    line: Line;

    constructor() {
      this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

      TD.width = this.canvas.width;
      TD.height = this.canvas.height;

      this.line = TD.randomLineTroughCenter(this.canvas.width, this.canvas.height);

      var n = 10;

      var possies1 = TD.createArmy(n, this.line);
      for (let i = 0; i < possies1.length; i++) {
          this.things.push(new TD.Soldier(possies1[i]));
      }

      var possies2 = TD.createArmy(n, this.line);
      for (let i = 0; i < possies2.length; i++) {
          this.things.push(new TD.Mage(possies2[i]));
      }

      var possies3 = TD.createArmy(n, this.line);
      for (let i = 0; i < possies3.length; i++) {
          this.things.push(new TD.Archer(possies3[i]));
      }

      this.draw();
      var bla = this;
      this.canvas.onclick = function(e) {
        bla.click(e);
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var image = <HTMLImageElement>document.getElementById("imgBackground");
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

      this.ctx.beginPath();
      this.ctx.moveTo(this.line.point1.x, this.line.point1.y);
      this.ctx.lineTo(this.line.point2.x, this.line.point2.y);
      this.ctx.stroke();

      // draw all the things
      for (let i = 0; i < this.things.length; i++) {
          var thing = this.things[i];
          thing.draw(this.ctx);
      }
    }
    click(e: MouseEvent) {
      var mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
      var mouseY = e.clientY - this.canvas.getBoundingClientRect().top;

      for (let i = 0; i < this.things.length; i++) {
        var thing = this.things[i];

        var xRange = new TD.Range(thing.x, thing.x + thing.width);
        var yRange = new TD.Range(thing.y, thing.y + thing.height);

        if (xRange.constains(mouseX) && yRange.constains(mouseY)) {
          thing.select();
          break;
        }
      }

      this.draw();
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
