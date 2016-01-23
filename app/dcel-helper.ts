module Algo{
  //DCEL help functions
  export function createClokWiseCycle(vertices: Array<Vertex>):Array<Halfedge>{
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

  export function insertVertexInEdge(intersection:PositionOnEdge, dcel:DCEL):Vertex{
    //returns the inserted Vertex
    //If the requested insertion Position is on a endpoint we insert no vertex
    //and instead return said endpoint
    var edge = intersection.edge
    var pos = intersection.pos

    if(Algo.samePos(edge.fromvertex, pos)){
      console.error("Requested insertion in Edge on fromvertex", edge, pos)
      return edge.fromvertex
    }

    if(Algo.samePos(edge.tovertex, pos)){
      console.error("Requested insertion in Edge on tovertex", edge, pos)
      throw "terminate"
      // return edge.tovertex
    }
    if (isNaN(pos.x) || isNaN(pos.y)){
      throw "Unexpected NaN"
    }


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

  export function addEdgeInFace(vertex1:Vertex, vertex2: Vertex, face:Face, dcel:DCEL):Face{
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
      throw "Vertices do appear to not lie on the boundary of the provided face"
    }

    try{
      var newedge = new Halfedge(vertex1, vertex2)
      dcel.edges.push(newedge)
      chain(to1, newedge)
      chain(newedge, from2)

      var newtwinedge = new Halfedge(vertex2, vertex1)
      dcel.edges.push(newtwinedge)
      chain(to2, newtwinedge)
      chain(newtwinedge, from1)
    }catch(Error){
      console.error(vertex1, vertex2, face, dcel)
      throw "Failure inserting edge"
    }

    twin(newedge, newtwinedge)

    //update face reference (and add face)
    var newface=new Algo.Face(newtwinedge)
    dcel.faces.push(newface)
    newedge.incidentFace=face
    face.outerComponent=newedge
    updateInicidentFaceInCycle(newtwinedge, newface)

    if(dcel.faces.length >100){
      throw Error("More faces then expeted")
    }


    return newface

  }

  export function updateInicidentFaceInCycle(startedge:Algo.Halfedge, face:Algo.Face):void{
    var workingedge = startedge
    do{
      workingedge.incidentFace = face
      workingedge=workingedge.next
    } while (workingedge !== startedge)
  }

  export function twin(edge1:Algo.Halfedge, edge2:Algo.Halfedge):void{
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

  export function chain(edge1:Algo.Halfedge, edge2:Algo.Halfedge){
    //updates next and prev references
    edge1.next =edge2
    edge2.prev = edge1
  }

}
