module Algo{
  export module Draw{
    var vsize =20000
    var hsize = 1000
    var ctx:CanvasRenderingContext2D;//context of the debug context

    export function setCanvasContext(contex:CanvasRenderingContext2D){
      ctx = contex
    }

    export function clearCanvas():void{
      // Store the current transformation matrix
      ctx.save();

      // Use the identity matrix while clearing the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, hsize,vsize);

      // Restore the transform
      ctx.restore();
    }

    export function dot( x:number,  y:number){
      ctx.beginPath();
      ctx.arc(x,y,.6,0,2*Math.PI);
      ctx.fill();
    }

    function drawEdge(edge:Halfedge){
      ctx.beginPath()
      ctx.moveTo(edge.fromvertex.x, edge.fromvertex.y)
      ctx.lineTo(edge.tovertex.x, edge.tovertex.y)
      ctx.stroke()
    }

    export function drawLine(line:Algo.AlgoLine, color:string){
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(-hsize, line.heightatyaxis+ -hsize*line.slope)
      ctx.lineTo(hsize, line.heightatyaxis + hsize*line.slope)
      ctx.stroke()

    }

    export function setViewport(x:number, y:number, width:number, height:number){
      var xscalefactor = hsize/width
      var yscalefactor = vsize/height
      console.log("xscale", xscalefactor,"yscale" ,yscalefactor)
      var scale = Math.min(xscalefactor, yscalefactor)
      ctx.setTransform(scale,0,0,scale,0,0)
      ctx.translate(-x,-y)

      dot(x,y)
      dot(x+width,y+height)

    }

    export function DrawDcel(dcel:Algo.DCEL, color:string){
      var bbox = dcel.boundingBox
      var edges = dcel.edges
      var vertices =dcel.vertices
      var i

      ctx.strokeStyle = color;

      ctx.lineWidth= .1
      ctx.strokeRect(bbox.minx, bbox.miny, bbox.maxx-bbox.minx, bbox.maxy - bbox.miny)

      ctx.lineWidth = .2

      for(i=0; i<vertices.length; i++){
        dot(vertices[i].x, vertices[i].y)
      }

      for(i=0; i<edges.length; i++){
        drawEdge(edges[i])
      }

    }
  }
}
