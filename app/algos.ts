module TD {
  class AlgoLine{
    //does not support vertical lines, but duality never yields vertical lines
    slope: number
    heightatyaxis: number
  }

  //Clases for DCEL
  class Vertex extends Position{
    incidentEdge: Halfedge //Some Halfedge leaving this vertex

    constructor(x, y){
      super()
      this.x =x
      this.y =y
    }
  }

  class AlgoBoundingBox{
    minx:number
    maxx:number
    miny:number
    maxy:number
  }

  class Halfedge{
    fromvertex: Vertex
    tovertex: Vertex
    twin: Halfedge
    prev: Halfedge
    next: Halfedge
    incidentFace: Face //the unique incident face

    constructor(fromvertex, tovertex){
      this.fromvertex=fromvertex
      this.tovertex=tovertex
    }
  }

  class Face{
    outerComponent: Halfedge
    //innerComponents: Array<Halfedge> Not nessecary in our case (Line arrangment)

    constructor(outerComponent){
      this.outerComponent = outerComponent
    }
  }

  class DCEL{
    constructor(public vertices:Array<Vertex>, public edges:Array<Halfedge>, public faces:Array<Face>){

    }
    //Q: Is the overarching structure necesarry?

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
    if (points.length===0){
      throw Error("Request to dualize 0 points")
    }
    console.log(points)
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
      function findBoundingBox(lines: Array<AlgoLine>): AlgoBoundingBox{
        if (lines.length < 2 ){
          throw Error("Not enough lines provided")
        }
        var sortedLines = lines.sort(function(line1:AlgoLine, line2:AlgoLine){return line1.slope- line2.slope})

        var point = intersectLines(sortedLines[0],sortedLines[1]);
        var result = new AlgoBoundingBox
        result.minx=point.x;
        result.maxx=point.x;
        result.miny=point.y;
        result.maxy=point.y;

        //Outermost (in both x and y) intersections are between lines of adjecent slope
        for(var i = 1; i<sortedLines.length-1 ; i++){
          var candidatepoint = intersectLines(sortedLines[0],sortedLines[1])

          if (candidatepoint.x < result.minx ){
            result.minx=candidatepoint.x
          } else if (candidatepoint.x > result.maxx){
            result.maxx = candidatepoint.x
          }

          if (candidatepoint.y < result.minx ){
            result.minx=candidatepoint.y
          } else if (candidatepoint.y > result.maxx){
            result.maxx = candidatepoint.y
          }

        }

        //relax bounding box a little (such that no intersections are actually on the boundinBox)
        result.minx = result.minx - 10;
        result.maxx = result.maxx + 10;
        result.miny = result.miny - 10;
        result.maxy = result.maxy + 10
        return result;
        }

      function initialDCELfromBoundingBox(bBox:AlgoBoundingBox):DCEL{
        var topleft = new Vertex(bBox.minx, bBox.maxy)
        var topright = new Vertex(bBox.maxx, bBox.maxy)
        var downleft = new Vertex(bBox.minx, bBox.miny)
        var downright = new Vertex(bBox.maxx, bBox.miny)

        var vertices = new Array(topleft, topright, downright, downleft)

        var interiorEdges = createClokWiseCycle(vertices)
        var outerEdges  = createClokWiseCycle(vertices.reverse())

        //now twin them
        var lastinedge= interiorEdges[interiorEdges.length-1]
        var lastoutedge = outerEdges[outerEdges.length-1]

        twin(lastinedge, lastoutedge)

        var workingedge = lastinedge.next
        while (workingedge !== lastinedge){
          var twintobe = workingedge.prev.twin.prev
          twin(workingedge, twintobe)
          workingedge = workingedge.next
        }

        return new DCEL(vertices,
          interiorEdges.concat(outerEdges),
           [lastinedge.incidentFace, lastoutedge.incidentFace])
      }
      //first find BoundingBox
      var boundinBox:AlgoBoundingBox = findBoundingBox(lines)
      console.log ("BoundingBox", boundinBox)
      var graph:DCEL = initialDCELfromBoundingBox(boundinBox)
      //incremental construction form slides 8.46 and further
      //TODO

      return null;
    }

    function findFeasibleRegion(arrangment: DCEL): Array<Face>{
      //returns the faces in which the dual point may lie to represent a cut
      // cutting a given army in two equal parts in the primal plane.

      //TODO
      throw Error("findFeasibleRegion not yet implemented" )    }

    function findPointInRegions(region1: Array<Face>, region2: Array<Face>, region3: Array<Face>): Position{
      //returns a point in all 3 regions, or null when this is impossible

      throw Error("findPointInRegions not yet implemented" )
      //TODO
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

    //Small Geometric methods
    function intersectLines(line1: AlgoLine, line2: AlgoLine): Position{
      var result = new Position();
      var dy = line1.heightatyaxis - line2.heightatyaxis;
      var comparitiveslope = line1.slope - line2.slope
      result.x = -dy/comparitiveslope;
      result.y = line1.heightatyaxis + result.x *line1.slope;
      return result;
    }

    //DCEL help functions
    function createClokWiseCycle(vertices: Array<Vertex>):Array<Halfedge>{
      var i
      //returns all Halfedges in the cycle, the newly created interior face is then easaliy found
      //all properties are set except for
      var edges:Array<Halfedge>=[]

      for(i = 0; i < vertices.length-1; i++){
        edges.push(new Halfedge(vertices[i], vertices[i+1]))
      }
      edges.push(new Halfedge(vertices[vertices.length-1], vertices[0]))

      var face = new Face(edges[0])

      //set aditional properties
      edges[0].prev =edges[edges.length-1]
      edges[0].next =edges[1]
      edges[0].incidentFace = face
      for(i=1; i < edges.length -1; i++){
        edges[i].prev = edges[i-1]
        edges[i].next = edges[i+1]
        edges[i].incidentFace =face
      }
      edges[edges.length-1].prev = edges[edges.length-1]
      edges[edges.length-1].next = edges[0]
      edges[edges.length-1].incidentFace = face


      return edges
    }

    function twin(edge1:Halfedge, edge2:Halfedge):void{
      //Twins two edges to each other
      if(!(edge1.twin===undefined && edge2.twin===undefined)){
        Error("One or more twins already defined")
      }
      if(!(edge1.fromvertex === edge2.tovertex && edge1.tovertex === edge2.fromvertex)){
        Error("These edges can't be twins")
      }
      edge1.twin=edge2
      edge2.twin=edge1
    }
}
