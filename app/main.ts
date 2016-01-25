module TD {
  export var width: number;
  export var height: number;

  export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    things: Array<Entity> = [];
    line: Line;

    cut: Algo.Cut

    constructor() {
      this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      console.log(this.ctx)

      try{
        var debugctx = (<HTMLCanvasElement>document.getElementById("debug")).getContext("2d");
        Algo.Draw.setCanvasContext(debugctx)
      } catch( TypeError){
        console.info("couldnt init debug context")
      }


      TD.width = this.canvas.width;
      TD.height = this.canvas.height;

      this.line = Algo.randomLineTroughCenter(this.canvas.width, this.canvas.height);

      var n = 3;

      var possies1 = Algo.createArmy(n, this.line);
      for (let i = 0; i < possies1.length; i++) {
          this.things.push(new TD.Soldier(possies1[i]));
      }

      var possies2 = Algo.createArmy(n, this.line);
      for (let i = 0; i < possies2.length; i++) {
          this.things.push(new TD.Mage(possies2[i]));
      }

      var possies3 = Algo.createArmy(n, this.line);
      for (let i = 0; i < possies3.length; i++) {
          this.things.push(new TD.Archer(possies3[i]));
      }


      var swaps = 1;
      for (let i = 0; i < swaps; i++) {
          var s1 = Math.floor(Math.random() * n*3);
          var s2 = Math.floor(Math.random() * n*3);
          var first = this.things[s1];
          var second = this.things[s2];
          TD.swap(first, second);
      }


      this.draw();
      var bla = this;
      this.canvas.onclick = function(e) {
        bla.click(e);
      }
    }

    draw() {
      console.log(this.ctx)
      var context = this.ctx
      function drawLines(lines, colors){
        for (var i = 0; i < lines.length; i++){
          context.strokeStyle =  colors[i]
          for (var j = 0; j < lines[i].length; j++){
            var line = lines[i][j]
            console.log("drawing line", line)
            context.beginPath();
            context.moveTo(0, line.heightatyaxis);
            context.lineTo(TD.width, line.heightatyaxis + TD.width* line.slope);
            context.stroke();
          }
        }
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var image = <HTMLImageElement>document.getElementById("imgBackground");
      //this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

      if((<HTMLInputElement>document.getElementById("creationline")).checked === true){
        this.ctx.beginPath();
        this.ctx.moveTo(this.line.point1.x, this.line.point1.y);
        this.ctx.lineTo(this.line.point2.x, this.line.point2.y);
        this.ctx.stroke();
      }

      if (this.cut){
        if((<HTMLInputElement>document.getElementById("archercutlines")).checked === true){
          console.log("ARCHERS!", this.cut.archerlines)
          drawLines(this.cut.archerlines,
                    ["#330031","#660062","#b300ab", "#ff00f5"]) //purles
        }
        if((<HTMLInputElement>document.getElementById("soldiercutlines")).checked === true){
          console.log("soldiers!", this.cut.soldierlines)
          drawLines(this.cut.soldierlines,
                    ["#330000","#660000","#b30000", "#ff0000"]) //reds
        }
        if((<HTMLInputElement>document.getElementById("magecutlines")).checked === true){
          console.log("mages!", this.cut.magelines)
          drawLines(this.cut.magelines,
                    ["#000031","#000062","#0000ab", "#0000f5"]) //blues
        }
      }



      // draw all the things
      for (let i = 0; i < this.things.length; i++) {
          var thing = this.things[i];
          thing.draw(this.ctx);
      }
    }

    selected = new collections.Set<Entity>();

    click(e: MouseEvent) {
      var mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
      var mouseY = e.clientY - this.canvas.getBoundingClientRect().top;

      for (let i = 0; i < this.things.length; i++) {
        var thing = this.things[i];

        var xRange = new TD.Range(thing.x, thing.x + thing.width);
        var yRange = new TD.Range(thing.y, thing.y + thing.height);

        if (xRange.constains(mouseX) && yRange.constains(mouseY)) {
          if (this.selected.contains(thing)) {
            this.selected.remove(thing);
            thing.select(false);
          } else {
            this.selected.add(thing);
            thing.select(true);
          }
          this.onSelected();
          break;
        }
      }

      this.draw();
    }

    onSelected() {
      if (this.selected.size() == 2) {
        //swap
        var arr = this.selected.toArray();
        var first = arr[0];
        var second = arr[1];

        TD.swap(first, second);

        first.select(false);
        second.select(false);
        this.selected.clear();

        //find a cut
        console.log("findCut")
        this.cut = Algo.findCut(this.things);
      }
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
