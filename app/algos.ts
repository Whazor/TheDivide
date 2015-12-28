module TD {
  export function aboveLine(line: TD.Line, thing: TD.Position&TD.BoundingBox): boolean {
    // Do Sander things


    return true;
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
    pos2.x = 300*Math.sin(angle);
    pos2.y = 300*Math.cos(angle);

    var line = new TD.Line();
    line.point1 = pos;
    line.point2 = pos2;
    return line;
  }

  export function createArmy(n: number, line: TD.Line): Array<Position&BoundingBox&Draw> {
    var things: Array<Position&BoundingBox&Draw> = [];

    // Do Sander things


    return things;
  }

  // def OBSFUCATEPOINTS(n):
  // # Swaps n points

  export function findCut(army: Array<Position&BoundingBox>): Line {
    return null;
  }
}
