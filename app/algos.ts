module TD {
  class AlgoLine{
    //does not support vertical lines, but duality never yields vertical lines
    slope: number
    heightatyaxis: number
  }

  //Clases for DCEL
  class Vertex extends Position{
    incidentEdge: Halfedge //Some Halfedge leaving this vertex
  }

  class Halfedge{
    fromvertex: Vertex
    tovertex: Vertex
    twin: Halfedge
    prev: Halfedge
    next: Halfedge
    incidentFace: Face //the unique incident face
  }

  class Face{
    outerComponent: Halfedge
    //innerComponents: Array<Halfedge> Not nessecary in our case (Line arrangment)
  }

  class DCEL{
    //Q: Is the overarching structure necesarry?
    faces: Array<Face>
    edges: Array<Halfedge>
    vertices: Array<Vertex>
  }
  //End Clases for DCEL

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
    var archerarmy: Array<Archer> = [];
    var soldierarmy: Array<Soldier> = [];
    var magearmy: Array<Mage> = [];

    for (var  i = 0 ; i<army.length ; i++){
      if (army[i] instanceof Archer){
        archerarmy.push(<Archer>army[i]);
        continue;
      }
      if (army[i] instanceof Soldier){
        soldierarmy.push(<Soldier>army[i]);
        continue;
      }
      if (army[i] instanceof Mage){
        magearmy.push(<Mage>army[i]);
        continue;
      }
      throw new Error("Entity found that is not Soldier, Archer or Mage")
    }

    var archerDCEL = makearrangement(dualizePoints(archerarmy));
    var mageDCEL =makearrangement(dualizePoints(magearmy));
    var soldierDCEL = makearrangement(dualizePoints(soldierarmy));

    var dualPos:Position = findPointInRegions(findFeasibleRegion(archerDCEL),
                                              findFeasibleRegion(mageDCEL),
                                              findFeasibleRegion(soldierDCEL));

    return dualizePoint(dualPos);
  }

  function dualizePoints(points: Array<Position>): Array<AlgoLine>{
    var result: Array<AlgoLine> =[];
    for(var i = 0; i<points.length; i++){
      var pos: Position = points[i];
      var line = new AlgoLine();
      line.slope=pos.x;
      line.heightatyaxis= - pos.y
      result.push(line);
    }
    return result;
  }

    function makearrangement(lines: Array<AlgoLine>): DCEL{
      //incremental construction form slides 8.46 and further

      //TODO
      return null;
    }

    function findFeasibleRegion(arrangment: DCEL): Array<Face>{
      //returns the faces in which the dual point may lie to represent a cut
      // cutting a given army in two equal parts in the primal plane.

      //TODO
      return null
    }

    function findPointInRegions(region1: Array<Face>, region2: Array<Face>, region3: Array<Face>): Position{
      //returns a point in all 3 regions, or null when this is impossible

      //TODO
      return null;
    }

    function dualizePoint(point: Position):Line{
      var algoLine:AlgoLine = dualizePoints([point])[0];
      var pos1 = new Position();
      pos1.x=0
      pos1.y=algoLine.heightatyaxis;

      var pos2 = new Position();
      pos2.x = 100;
      pos2.y = algoLine.heightatyaxis + 100 * algoLine.slope;

      var line:TD.Line = new TD.Line();
      line.point1 = pos1;
      line.point2 = pos2;
      return line;
    }
}
