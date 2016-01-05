module TD {
  export function aboveLine(line: TD.Line, point: TD.Position): boolean {
    //Returns true when point is above line
    var pointx = point.x
    if (line.point1.x == line.point2.x){
      //TODO Vertical line, do stuff
    }

    if (line.point1.x < line.point2.x){
      var lowxpoint = line.point1
      var highxpoint = line.point2
    }else{
      var lowxpoint = line.point2
      var highxpoint = line.point1
    }
    var rc= (highxpoint.y - lowxpoint.y) / (highxpoint.x -lowxpoint.x)
    console.log("line", line, "rc", rc)

    var deltax = pointx - lowxpoint.x
    var liney = lowxpoint.y + deltax * rc

    return (point.y<liney); //< instead of > to take care of inverted y-axis
  }

  export function randomPosition(width:number, height:number): TD.Position {
    var pos = new TD.Position();
    pos.x = Math.floor(Math.random() * (width+1));
    pos.y = Math.floor(Math.random() * (height+1));
    return pos;
  }

  export function randomLineTroughCenter(width:number, height:number): TD.Line {
    //Creates a random line trough the center of the box with given dimensions


    var pos = randomPosition(width/2, height/2);
    pos.x += .25*width
    pos.y += .25*height

    var angle = Math.random() * 2*Math.PI;

    var pos2 = new TD.Position();
    pos2.x = pos.x + 300*Math.sin(angle);
    pos2.y = pos.y + 300*Math.cos(angle);

    var line = new TD.Line();
    line.point1 = pos;
    line.point2 = pos2;
    return line;
  }

  export function createArmy(n: number, line: TD.Line): Array<Position> {
    var things: Array<Position> = [];

    // Do Sander things
    var points_above = [];
    var points_below = [];

    while (points_above.length < n/2 || points_below.length < n/2) {
      var pos = randomPosition(TD.width, TD.height);

      if (aboveLine(line, pos)) {
        if (points_above.length < n/2) {
          points_above.push(pos);
        }
      } else {
        if (points_below.length < n/2) {
          points_below.push(pos);
        }
      }
    }

    return points_above.concat(points_below);
  }

  // def OBSFUCATEPOINTS(n):
  // # Swaps two points n times

  export function findCut(army: Array<Entity>): TD.Line {
    return null;
  }
}
