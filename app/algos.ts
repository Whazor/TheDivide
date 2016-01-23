module Algo {
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

  export function createArmy(n: number, line: TD.Line): Array<TD.Position> {
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

  export function findCut(army: Array<TD.Entity>): TD.Line {
    var archerarmy: Array<TD.Archer> = [];
    var soldierarmy: Array<TD.Soldier> = [];
    var magearmy: Array<TD.Mage> = [];

    for (var  i = 0 ; i<army.length ; i++){
      if (army[i] instanceof TD.Archer){
        archerarmy.push(<TD.Archer>army[i]);
        continue;
      }
      if (army[i] instanceof TD.Soldier){
        soldierarmy.push(<TD.Soldier>army[i]);
        continue;
      }
      if (army[i] instanceof TD.Mage){
        magearmy.push(<TD.Mage>army[i]);
        continue;
      }
      throw new Error("Entity found that is not Soldier, Archer or Mage")
    }

    var archerDCEL = makearrangement(dualizePoints(archerarmy));
    var mageDCEL =makearrangement(dualizePoints(magearmy));
    var soldierDCEL = makearrangement(dualizePoints(soldierarmy));

    var dualPos:TD.Position = findPointInRegions(findFeasibleRegion(archerDCEL),
                                              findFeasibleRegion(mageDCEL),
                                              findFeasibleRegion(soldierDCEL));

    return dualizePoint(dualPos);
  }

  function dualizePoints(points: Array<TD.Position>): Array<AlgoLine>{
    if (points.length===0){
      throw Error("Request to dualize 0 points")
    }
    var result: Array<AlgoLine> =[];
    for(var i = 0; i<points.length; i++){
      var pos: TD.Position = points[i];
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

      var point = Algo.intersectLines(sortedLines[0],sortedLines[1]);
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

      //relax bounding box a little (such that no intersections are actually on the boundingBox)
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

      var interiorEdges = Algo.createClokWiseCycle(vertices)
      var outerEdges  = Algo.createClokWiseCycle(vertices.reverse())
      var edges = interiorEdges.concat(outerEdges)

      //now twin them
      var workingedge = interiorEdges[interiorEdges.length-1]
      Algo.twin(workingedge, outerEdges[outerEdges.length-1])

      var workingedge = workingedge.next
      while (workingedge !== interiorEdges[interiorEdges.length-1]){
        var twintobe = workingedge.prev.twin.prev
        Algo.twin(workingedge, twintobe)

        workingedge = workingedge.next
      }

      return new DCEL(vertices,
                      edges,
                      [interiorEdges[0].incidentFace, outerEdges[0].incidentFace],
                      outerEdges[0].incidentFace,
                      bBox)
    }


    function addLineToDCEL(line:AlgoLine, dcel:DCEL):void{
      //first find intersections on the outer face
      var startedge = dcel.outerface.outerComponent
      var intersections:Array<PositionOnEdge> = []
      var workingedge = startedge

      do{
        var intersection = intersectEdgeLine(workingedge, line)
        if (intersection !== null){
          intersections.push(intersection)
          //console.log("intersection on edge", dcel.edges.indexOf(intersection.edge), intersection.pos)
        }
        workingedge = workingedge.next
      }while (workingedge !== startedge)

      console.info("intersections with outer boundary (hopfully two)", intersections)

      var leftintersection, rightintersection
      if (intersections[0].pos.x < intersections[1].pos.x){
        leftintersection = intersections[0]
        rightintersection = intersections[1]
      } else {
        leftintersection = intersections[1]
        rightintersection = intersections[0]
      }

      var workingvertex = Algo.insertVertexInEdge(leftintersection.edge, leftintersection.pos, dcel)
      workingedge = leftintersection.edge.twin.next

      while (workingedge.incidentFace !== dcel.outerface){
        while (intersection === null){
          intersection = intersectEdgeLine(workingedge, line)
          workingedge=workingedge.next
        };

        console.log("found intersection", intersection, intersection.pos.x , intersection.pos.y, "edge", dcel.edges.indexOf(intersection.edge))

        var newvertex = Algo.insertVertexInEdge(intersection.edge, intersection.pos, dcel)
        Algo.addEdgeInFace(workingvertex, newvertex, intersection.edge.incidentFace, dcel)
        workingvertex = newvertex
        workingedge = workingedge.twin.next
      }
    }

    //first find BoundingBox
    var boundingBox:AlgoBoundingBox = findBoundingBox(lines)
    console.log ("BoundingBox", boundingBox)
    var graph = initialDCELfromBoundingBox(boundingBox)
    console.log("start adding lines", lines)
    for (var i=0; i <lines.length; i++){
      Algo.checkWellformedDCEL(graph)
      addLineToDCEL(lines[i], graph);
    }
    Algo.checkWellformedDCEL(graph)

    return graph;

  }

  function findFeasibleRegion(arrangment: DCEL): Array<Face>{
    function isEdgeLeadingToRightMostVertex(edge:Halfedge){
      if (edge.fromvertex.x <= edge.tovertex.x && edge.next.fromvertex.x >= edge.next.tovertex.x){
        console.log("return true")
        return true
      }
      console.log("return false")
      return false

    }
    //returns the faces in which the dual point may lie to represent a cut
    // cutting a given army in two equal parts in the primal plane.
    var workingedge = arrangment.outerface.outerComponent
    var minx = arrangment.boundingBox.minx
    var leftedges: Array<Halfedge> =[]
    while (! (workingedge.tovertex.x == minx && workingedge.fromvertex.x != minx)){
      workingedge = workingedge.next
    }


    workingedge = workingedge.next //workingedge is now the first edge with both from.x and to.x = minx
                                   // (i.e. leftupper edge)

    while (workingedge.tovertex.x == minx ){
      leftedges.push(workingedge)
      workingedge = workingedge.next
    }

    if (leftedges.length %2 == 0 ){
      throw Error("Unexpected even number of leftmost edges "+ leftedges.length)
    }
    console.log("All leftedges", leftedges)


    var middleleftedge = leftedges[(leftedges.length -1)/2]
    var startingFace = middleleftedge.twin.incidentFace
    var feasibleFaces= [startingFace]

    //itrate trough the faces until we hit the outer face again
    workingedge= middleleftedge.twin
    while(true){
      var dbstartedge = workingedge
      while (! isEdgeLeadingToRightMostVertex(workingedge)){
        workingedge = workingedge.next
        console.log("edge index", arrangment.edges.indexOf(workingedge), "start", arrangment.edges.indexOf(dbstartedge), workingedge)
        if (workingedge === dbstartedge){
          throw Error("OMG")
        }
      }
      workingedge = workingedge.twin.prev.twin  // Goes from  *\/ to \/*
      if(workingedge.incidentFace === arrangment.outerface){
        break;
      }else{
        feasibleFaces.push(workingedge.incidentFace)
        if (feasibleFaces.length >100){
          throw Error("Unexpected large amount of feasible faces")
        }
      }
    }
    console.log("feasibleFaces", feasibleFaces)



    //TODO
    throw Error("findFeasibleRegion not yet implemented" )    }

  function findPointInRegions(region1: Array<Face>, region2: Array<Face>, region3: Array<Face>): TD.Position{
    //returns a point in all 3 regions, or null when this is impossible

    throw Error("findPointInRegions not yet implemented" )
    //TODO
    }

  function dualizePoint(point: TD.Position):TD.Line{
    var algoLine:AlgoLine = dualizePoints([point])[0];
    var pos1 = new TD.Position();
    pos1.x=0
    pos1.y=algoLine.heightatyaxis;

    var pos2 = new TD.Position();
    pos2.x = 100;
    pos2.y = algoLine.heightatyaxis + 100 * algoLine.slope;

    var line:TD.Line = new TD.Line();
    line.point1 = pos1;
    line.point2 = pos2;
    return line;
  }


  function intersectEdgeLine(edge:Halfedge, line:AlgoLine){
      //returns intersection point (if any) otherwise returns null

      //create line for edge
      var edgeline = new AlgoLine()
      edgeline.slope = (edge.fromvertex.y -edge.tovertex.y)/(edge.fromvertex.x - edge.tovertex.x)
      edgeline.heightatyaxis = edge.fromvertex.y - edgeline.slope * edge.fromvertex.x

      var intersection = intersectLines(edgeline, line)

      //TODO make more robust (i)

      var dy = Math.abs(edge.fromvertex.y - edge.tovertex.y )
      var dx = Math.abs(edge.fromvertex.x - edge.tovertex.x )
      if (dx>dy) {
        if (Algo.inInterval(intersection.x, edge.fromvertex.x, edge.tovertex.x)){
          return new PositionOnEdge(intersection, edge)
        }
      }else{
        if (Algo.inInterval(intersection.y, edge.fromvertex.y, edge.tovertex.y))
          return new PositionOnEdge(intersection,edge)
      }

      return null;
  }
}
