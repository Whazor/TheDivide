module TD {
  export var width: number;
  export var height: number;

  export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    things: Array<Entity> = [];
    line: Line;

    playerLine: Line = new Line();
    cut: Algo.Cut
    selected = new collections.Set<Entity>();


    constructor() {
      this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

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


      var swaps = 3;
      for (let i = 0; i < swaps; i++) {
          var s1 = Math.floor(Math.random() * n*3);
          var s2 = Math.floor(Math.random() * n*3);
          var first = this.things[s1];
          var second = this.things[s2];
          TD.swap(first, second);
      }

      this.draw(this.ctx);
      var bla = this;

      var start: Position;
      var isCreatingLine = false;
      this.canvas.addEventListener("mousedown", function(e: MouseEvent) {
        var mouseX = e.clientX - bla.canvas.getBoundingClientRect().left;
        var mouseY = e.clientY - bla.canvas.getBoundingClientRect().top;
        start = new Position();
        start.x = mouseX;
        start.y = mouseY;
        isCreatingLine = true;
      });

      this.canvas.addEventListener("mousemove", function(e: MouseEvent) {
        var mouseX = e.clientX - bla.canvas.getBoundingClientRect().left;
        var mouseY = e.clientY - bla.canvas.getBoundingClientRect().top;

        var current = new Position();
        current.x = mouseX;
        current.y = mouseY;

        if (isCreatingLine) {
          bla.playerLine.point1 = start;
          bla.playerLine.point2 = current;
          bla.playerLine = TD.extendLine(bla.playerLine, TD.width, TD.height);
        }
        bla.draw(bla.ctx);
      });

      this.canvas.addEventListener("mouseup", function(e: MouseEvent) {
        var mouseX = e.clientX - bla.canvas.getBoundingClientRect().left;
        var mouseY = e.clientY - bla.canvas.getBoundingClientRect().top;
        isCreatingLine = false;
        var playerResult = Algo.evaluateCut(bla.playerLine, bla.things)

        var main = document.getElementById("mainfb")
        var sub = document.getElementById("subfb")
        main.innerHTML =""
        sub.innerHTML = ""

        console.log("setting FB", playerResult)

        if (playerResult.archers && playerResult.soldiers && playerResult.mages){
          main.innerHTML = "Great cut!"
          sub.innerHTML = "Refresh to play again"
          return
        }
        if (!playerResult.archers && playerResult.soldiers && playerResult.mages){
          main.innerHTML = "Good cut!"
          sub.innerHTML = "Your cut didn't divide the archers"
          return
        }
        if (playerResult.archers && !playerResult.soldiers && playerResult.mages){
          main.innerHTML = "Good cut!"
          sub.innerHTML = "Your cut didn't divide the soldiers"
          return
        }
        if (playerResult.archers && playerResult.soldiers && !playerResult.mages){
          main.innerHTML = "Good cut!"
          sub.innerHTML = "Your cut didn't divide the mages"
          return
        }
        else{
          main.innerHTML = "Poor cut"
          sub.innerHTML = "Use the options above to see viable cuts and try again!"
        }


      });

      this.canvas.onclick = function(e) {
        bla.click(e);
      }

      var game = this
      document.getElementById("archercutlines").onchange = function(){game.draw(game.ctx)}
      document.getElementById("soldiercutlines").onchange = function(){game.draw(game.ctx)}
      document.getElementById("magecutlines").onchange = function(){game.draw(game.ctx)}
      document.getElementById("creationline").onchange = function(){game.draw(game.ctx)}

    }

    draw(gcontext) {
      function drawLines(lines, colors){
        for (var i = 0; i < lines.length; i++){
          gcontext.strokeStyle =  colors[i]
          for (var j = 0; j < lines[i].length; j++){
            var line = lines[i][j]
            gcontext.beginPath();
            gcontext.moveTo(0, line.heightatyaxis);
            gcontext.lineTo(TD.width, line.heightatyaxis + TD.width* line.slope);
            gcontext.stroke();
          }
        }
      }

      gcontext.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //background
      var image = <HTMLImageElement>document.getElementById("imgBackground");
      gcontext.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

      if((<HTMLInputElement>document.getElementById("creationline")).checked === true){
        gcontext.beginPath();
        gcontext.strokeStyle = "black"
        gcontext.moveTo(this.line.point1.x, this.line.point1.y);
        gcontext.lineTo(this.line.point2.x, this.line.point2.y);
        gcontext.stroke();
      }

      if(this.playerLine && this.playerLine.point1 && this.playerLine.point2) {
        gcontext.beginPath();
        gcontext.strokeStyle = "black"
        gcontext.moveTo(this.playerLine.point1.x, this.playerLine.point1.y);
        gcontext.lineTo(this.playerLine.point2.x, this.playerLine.point2.y);
        gcontext.stroke();
      }


      if (this.cut){
        if((<HTMLInputElement>document.getElementById("archercutlines")).checked === true){
          drawLines(this.cut.archerlines,
                    ["#330031","#660062","#b300ab", "#ff00f5"]) //purles
        }
        if((<HTMLInputElement>document.getElementById("soldiercutlines")).checked === true){
          drawLines(this.cut.soldierlines,
                    ["#330000","#660000","#b30000", "#ff0000"]) //reds
        }
        if((<HTMLInputElement>document.getElementById("magecutlines")).checked === true){
          drawLines(this.cut.magelines,
                    ["#000031","#000062","#0000ab", "#0000f5"]) //blues
        }
        if((<HTMLInputElement>document.getElementById("solution")).checked === true){
          drawLines([this.cut.solutions],
                    ["#000000"]) //black
        }
      }

      // draw all the things
      for (let i = 0; i < this.things.length; i++) {
          var thing = this.things[i];
          thing.draw(gcontext);
      }
    }

    click(e: MouseEvent) {
      var mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
      var mouseY = e.clientY - this.canvas.getBoundingClientRect().top;

      for (let i = 0; i < this.things.length; i++) {
        var thing = this.things[i];

        var xRange = new TD.Range(thing.x-Math.floor(thing.width/2), thing.x + Math.floor(thing.width/2));
        var yRange = new TD.Range(thing.y-Math.floor(thing.height/2), thing.y + Math.floor(thing.height/2));

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

      this.draw(this.ctx);
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
