module Algo{
    export function checkWellformedDCEL(dcel:Algo.DCEL):boolean{
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

      //print information about the edges
      var edgesinfos = []
      for (i=0; i<edges.length; i++){
        var info = "edge "+i+" from ("+edges[i].fromvertex.x+","+edges[i].fromvertex.y+  ") to ("+edges[i].tovertex.x+","+edges[i].tovertex.y+") length:"+edges[i].length()
         edgesinfos.push(info)
      }
      console.info (edgesinfos)

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
