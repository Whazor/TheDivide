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

  export function randomLine(width:number, height:number): TD.Line {
    var pos = randomPosition(width, height);

    var angle = Math.random() * 2*Math.PI;

    var pos2 = new TD.Position();
    pos2.x = 1337;
    pos2.y = 1337;

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
