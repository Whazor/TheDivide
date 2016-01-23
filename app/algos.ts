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

  class PositionOnEdge{
    pos:Position
    edge:Halfedge

    constructor(pos, edge){
      this.pos = pos
      this.edge = edge
    }
  }

  class DCEL{
    constructor(public vertices:Array<Vertex>, public edges:Array<Halfedge>, public faces:Array<Face>, public outerface:Face, public boundingBox:AlgoBoundingBox){    }
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

      var interiorEdges = createClokWiseCycle(vertices)
      var outerEdges  = createClokWiseCycle(vertices.reverse())
      var edges = interiorEdges.concat(outerEdges)

      //now twin them
      var workingedge = interiorEdges[interiorEdges.length-1]
      twin(workingedge, outerEdges[outerEdges.length-1])

      var workingedge = workingedge.next
      while (workingedge !== interiorEdges[interiorEdges.length-1]){
        var twintobe = workingedge.prev.twin.prev
        twin(workingedge, twintobe)

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

      var workingvertex = insertVertexInEdge(leftintersection.edge, leftintersection.pos, dcel)
      workingedge = leftintersection.edge.twin.next

      while (workingedge.incidentFace !== dcel.outerface){
        while (intersection === null){
          intersection = intersectEdgeLine(workingedge, line)
          workingedge=workingedge.next
        }

        var newvertex = insertVertexInEdge(intersection.edge, intersection.pos, dcel)
        addEdgeInFace(workingvertex, newvertex, intersection.edge.incidentFace, dcel)
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
      checkWellformedDCEL(graph)
      addLineToDCEL(lines[i], graph);
    }
    checkWellformedDCEL(graph)

    return graph;

  }

  function findFeasibleRegion(arrangment: DCEL): Array<Face>{

    function isEdgeLeadingToRightMostVertex(edge:Halfedge){
      console.log(edge.fromvertex.x <= edge.tovertex.x, edge.next.fromvertex.x >= edge.next.tovertex.x)
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
        console.log(arrangment.faces.indexOf(workingedge.incidentFace))
        feasibleFaces.push(workingedge.incidentFace)
        if (feasibleFaces.length >100){
          throw Error("Unexpected large amount of feasible faces")
        }
      }
    }
    console.log("feasibleFaces", feasibleFaces)



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

  function intersectEdgeLine(edge:Halfedge, line:AlgoLine){
      //returns intersection point (if any) otherwise returns null

      //create line for edge
      var edgeline = new AlgoLine()
      edgeline.slope = (edge.fromvertex.y -edge.tovertex.y)/(edge.fromvertex.x - edge.tovertex.x)
      edgeline.heightatyaxis = edge.fromvertex.y - edgeline.slope * edge.fromvertex.x

      var intersection:Position = intersectLines(edgeline, line)

      //TODO make more robust (i)

      var dy = Math.abs(edge.fromvertex.y - edge.tovertex.y )
      var dx = Math.abs(edge.fromvertex.x - edge.tovertex.x )
      if (dx>dy) {
        if (inInterval(intersection.x, edge.fromvertex.x, edge.tovertex.x)){
          return new PositionOnEdge(intersection, edge)
        }
      }else{
        if (inInterval(intersection.y, edge.fromvertex.y, edge.tovertex.y))
          return new PositionOnEdge(intersection,edge)
      }

      return null;
  }

  //Other help functions
  function inInterval(value:number, bound1:number, bound2: number):boolean{
    //returns true when value is between bound1 and bound 2
    //TODO test for robustness
    var lower = Math.min(bound1, bound2)
    var upper = Math.max(bound1, bound2)

    if (value<upper && lower<value){
      return true;
    } else{
      return false
    }

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

    for(i=0; i < edges.length -1; i++){
      chain(edges[i], edges[i+1])
      edges[i].incidentFace =face
    }
    chain(edges[edges.length-1], edges[0])
    edges[edges.length-1].incidentFace = face


    return edges
  }

  function insertVertexInEdge(edge:Halfedge, pos:Position, dcel:DCEL):Vertex{
    //returns the inserted Vertex

    var vertex = new Vertex(pos.x, pos.y)
    dcel.vertices.push(vertex)
    var oldToVertex = edge.tovertex
    edge.tovertex= vertex
    edge.twin.fromvertex = vertex

    var newedge = new Halfedge(vertex, oldToVertex)
    var newtwinedge = new Halfedge(oldToVertex, vertex)
    dcel.edges.push(newedge)
    dcel.edges.push(newtwinedge)

    twin(newedge, newtwinedge)

    //fix pointers in the original cycle
    chain(newedge, edge.next)
    chain(edge, newedge)


    //fix pointers in the twin cycle
    chain(edge.twin.prev, newtwinedge)
    chain(newtwinedge, edge.twin)

    //set faces
    newedge.incidentFace = newedge.next.incidentFace
    newtwinedge.incidentFace = newtwinedge.next.incidentFace

    return vertex
  }

  function addEdgeInFace(vertex1:Vertex, vertex2: Vertex, face:Face, dcel:DCEL):Face{
    //returns the new face
    var startedge = face.outerComponent
    var workingedge = startedge

    var to1 =null, from1 = null, to2=null, from2=null
    do{
      if (workingedge.tovertex === vertex1){
        to1 = workingedge
        from1 = to1.next
      }
      if (workingedge.tovertex === vertex2){
        to2 = workingedge
        from2 = to2.next
      }
      workingedge=workingedge.next
    }while (workingedge !== startedge)

    if (to1===null || from1 === null || to2===null || from2===null){
      throw Error("Vertices do appear to not lie on the boundary of the provided face")
    }

    var newedge = new Halfedge(vertex1, vertex2)
    dcel.edges.push(newedge)
    chain(to1, newedge)
    chain(newedge, from2)

    var newtwinedge = new Halfedge(vertex2, vertex1)
    dcel.edges.push(newtwinedge)
    chain(to2, newtwinedge)
    chain(newtwinedge, from1)

    twin(newedge, newtwinedge)

    //update face reference (and add face)
    var newface=new Face(newtwinedge)
    dcel.faces.push(newface)
    newedge.incidentFace=face
    face.outerComponent=newedge
    updateInicidentFaceInCycle(newtwinedge, newface)

    if(dcel.faces.length >100){
      throw Error("More faces then expeted")
    }


    return newface

  }

  function updateInicidentFaceInCycle(startedge:Halfedge, face:Face):void{
    var workingedge = startedge
    do{
      workingedge.incidentFace = face
      workingedge=workingedge.next
    } while (workingedge !== startedge)
  }

  function twin(edge1:Halfedge, edge2:Halfedge):void{
    //Twins two edges to each other
    if(!(edge1.twin===undefined && edge2.twin===undefined)){
      throw Error("One or more twins already defined")
    }
    if(!(edge1.fromvertex === edge2.tovertex && edge1.tovertex === edge2.fromvertex)){
      throw Error("These edges can't be twins")
    }
    edge1.twin=edge2
    edge2.twin=edge1
  }

  function chain(edge1:Halfedge, edge2:Halfedge){
    //updates next and prev references
    edge1.next =edge2
    edge2.prev = edge1
  }

  function checkWellformedDCEL(dcel:DCEL):boolean{
    var correct = true;
    var i;
    var edges = dcel.edges
    var faces = dcel.faces

    //TODO edges of length zero
    //TODO vertices to close

    console.info("Cheking DCEL .." ,dcel)
    //euler formula check
    console.info("Faces ", dcel.faces.length, "HalfEdges", dcel.edges.length, "vertices", dcel.vertices.length)
    if (dcel.vertices.length - ( dcel.edges.length /2 )+ dcel.faces.length!=2){ // divide by two for halfedges
      console.error("Does not satisfy Euler charachteristic")
      correct = false
    }

    //prev-next check
    for(i=0; i<edges.length; i++){
      if(edges[i].prev.next !== edges[i]){
        console.error("Prev/next error in", i)
        correct = false
      }
      if(edges[i].next.prev !== edges[i]){
        console.error("nect/prev error in", i)
        correct = false
      }
    }

    //twin defined check
    for(i=0; i<edges.length; i++){
      if(edges[i].twin.twin !== edges[i]){
        console.error("no or invalid twin in edge", i)
        correct = false
      }
      if(edges[i].twin.fromvertex !== edges[i].tovertex){
        console.error("invalid twin vertex", i)
        correct = false
      }
      if(edges[i].fromvertex !== edges[i].twin.tovertex){
        console.error("invalid twin vertex", i)
        correct = false
      }
    }

    //cycle around a single face check
    for(i=0; i<faces.length; i++){
      var startedge=faces[i].outerComponent
      var workingedge=startedge
      var edgelist= [edges.indexOf(workingedge)]
      do{
        workingedge= workingedge.next
        if (workingedge.incidentFace !== faces[i]){
          console.error("Unexpacted face incident to edge", edges.indexOf(workingedge) )
          correct = false
        } else{
          edgelist.push(edges.indexOf(workingedge))
        }
      }while(workingedge !== startedge)
      console.info("Edges of face", i, ":" , edgelist)
    }

    //control from from/to vertices of next edges
    for(i=0; i<edges.length; i++){
      if(edges[i].prev.tovertex !== edges[i].fromvertex){
        console.error("Prev.to/from error in", i)
        correct = false
      }
      if(edges[i].next.fromvertex !== edges[i].tovertex){
        console.error("next.from/to error in", i)
        correct = false
      }
    }

    if (! correct){
      throw Error("Malformed graph")
    }

    console.info("Wellformed graph")
    return correct
  }

}
