module Algo{
  export module Draw{
    var size =10000
    var ctx:CanvasRenderingContext2D;//context of the debug context

    export function setCanvasContext(contex:CanvasRenderingContext2D){
      ctx = contex
    }

    export function clearCanvas():void{
      // Store the current transformation matrix
      ctx.save();

      // Use the identity matrix while clearing the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, size,size);

      // Restore the transform
      ctx.restore();
    }

    export function dot( x:number,  y:number){
      ctx.beginPath();
      ctx.arc(x,y,1,0,2*Math.PI);
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
      ctx.moveTo(-size, line.heightatyaxis+ -size*line.slope)
      ctx.lineTo(size, line.heightatyaxis + size*line.slope)
      ctx.stroke()

    }

    export function setViewport(x:number, y:number, width:number, height:number){
      //assum ctx is 1000*1000 px
      var scalefactor = Math.min(size/width, size/height)
      ctx.setTransform(scalefactor,0,0,scalefactor,0,0)
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

      ctx.lineWidth= .25
      ctx.strokeRect(bbox.minx, bbox.miny, bbox.maxx-bbox.minx, bbox.maxy - bbox.miny)

      ctx.lineWidth = .5

      for(i=0; i<vertices.length; i++){
        dot(vertices[i].x, vertices[i].y)
      }

      for(i=0; i<edges.length; i++){
        drawEdge(edges[i])
      }

    }
  }
}
