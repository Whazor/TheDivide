module Algo{
  //Other help functions
  export function inInterval(value:number, bound1:number, bound2: number):boolean{
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

  export function samePos(pos1:TD.Position, pos2:TD.Position){
    if (pos1.x == pos2.x && pos1.y == pos2.y){
      return true
    }
    return false
  }

  //Small Geometric methods
  export function intersectLines(line1: Algo.AlgoLine, line2: Algo.AlgoLine): TD.Position{
    var result = new TD.Position();
    var dy = line1.heightatyaxis - line2.heightatyaxis;
    var comparitiveslope = line1.slope - line2.slope
    result.x = -dy/comparitiveslope;
    result.y = line1.heightatyaxis + result.x *line1.slope;
    return result;
  }

 export function rightOfEdge(edge: Algo.Halfedge, pos:TD.Position){
   //consider orientation
   var edgeline = new TD.Line()
   edgeline.point1 = edge.fromvertex
   edgeline.point2 = edge.tovertex
   if (edge.fromvertex.x < edge.tovertex.x){
     //console.log("edge to the left")
     return Algo.aboveLine(edgeline, pos)
   } else if (edge.fromvertex.x > edge.tovertex.x){
     //console.log("edge to the right")
     return ! Algo.aboveLine(edgeline, pos)
   } else{
     //vertical edge
     if(edge.tovertex.y < edge.fromvertex.y){
       return pos.x < edge.fromvertex.x
     } else {
       return pos.x > edge.fromvertex.x
     }
   }
 }

 export function isInFace(pos: TD.Position, face:Algo.Face){
   var startedge = face.outerComponent
   var workingedge = startedge
   do {
     if(! rightOfEdge(workingedge, pos)){
       return false
     }
     workingedge = workingedge.next
   } while (workingedge !== startedge)
   console.log("This point is in the face")
   return true
 }

 export function faceBoundingbox(face:Algo.Face):Algo.AlgoBoundingBox{
   var bBox = new Algo.AlgoBoundingBox()

   var startedge = face.outerComponent
   bBox.minx = startedge.fromvertex.x
   bBox.maxx = startedge.fromvertex.x
   bBox.miny = startedge.fromvertex.y
   bBox.maxy = startedge.fromvertex.y

   var workingedge = startedge.next

   while (workingedge !== startedge) {
     if (workingedge.fromvertex.x < bBox.minx ){
       bBox.minx=workingedge.fromvertex.x
     } else if (workingedge.fromvertex.x > bBox.maxx){
       bBox.maxx = workingedge.fromvertex.x
     }

     if (workingedge.fromvertex.y < bBox.miny ){
       bBox.miny =workingedge.fromvertex.y
     } else if (workingedge.fromvertex.y > bBox.maxy){
       bBox.maxy = workingedge.fromvertex.y
     }

     workingedge = workingedge.next
   }
   return bBox
 }

 export function gridPointsInFace(xspacing:number, yspacing:number, face:Algo.Face){
   //first compute a boundingBox
   var bBox = faceBoundingbox(face)

   //Then create gridPointsInFace
   var xcoords = [-xspacing, 0] //slopes
   var xit = xspacing
   while(xit< bBox.maxx){
     xcoords.push(xit)
     xit = xit*1.5
   }
   var xit = -xspacing
   while(xit> bBox.minx){
     xcoords.push(xit)
     xit = xit*1.5
   }

   var gridpoints:Array<TD.Position> = []
   for(var i=0; i<xcoords.length; i++){
     console.log(Math.abs(xcoords[i]))
     for(var yit=0; yit<bBox.height(); yit+=(yspacing * Math.abs(xcoords[i]) + 2 ) ){
       //+2 to prevent trouble when the slope is 0
       var pos = new TD.Position()
       pos.x = xcoords[i]
       pos.y = bBox.miny + yit
       if( isInFace(pos, face)){
         gridpoints.push(pos)
       }
     }
   }

   return gridpoints

 }

}
