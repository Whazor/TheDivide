module Algo{
  export module Draw{
    var vsize =20000
    var hsize = 1000
    var ctx:CanvasRenderingContext2D;//context of the debug context

    export function setCanvasContext(contex:CanvasRenderingContext2D){
      this.ctx = contex
    }

    export function clearCanvas():void{
      // Store the current transformation matrix
      this.ctx.save();

      // Use the identity matrix while clearing the canvas
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, hsize,vsize);

      // Restore the transform
      this.ctx.restore();
    }

    export function dot( x:number,  y:number){
      this.ctx.beginPath();
      this.ctx.arc(x,y,.6,0,2*Math.PI);
      this.ctx.fill();
    }

    function drawEdge(edge:Halfedge){
      this.ctx.beginPath()
      this.ctx.moveTo(edge.fromvertex.x, edge.fromvertex.y)
      this.ctx.lineTo(edge.tovertex.x, edge.tovertex.y)
      this.ctx.stroke()
    }

    export function drawLine(line:Algo.AlgoLine, color:string){
      this.ctx.strokeStyle = color
      this.ctx.beginPath()
      this.ctx.moveTo(-hsize, line.heightatyaxis+ -hsize*line.slope)
      this.ctx.lineTo(hsize, line.heightatyaxis + hsize*line.slope)
      this.ctx.stroke()

    }

    export function setViewport(x:number, y:number, width:number, height:number){
      var xscalefactor = hsize/width
      var yscalefactor = vsize/height
      console.log("xscale", xscalefactor,"yscale" ,yscalefactor)
      var scale = Math.min(xscalefactor, yscalefactor)
      this.ctx.setTransform(scale,0,0,scale,0,0)
      this.ctx.translate(-x,-y)

      dot(x,y)
      dot(x+width,y+height)

    }

    export function DrawDcel(dcel:Algo.DCEL, color:string){
      var bbox = dcel.boundingBox
      var edges = dcel.edges
      var vertices =dcel.vertices
      var i

      this.ctx.strokeStyle = color;

      this.ctx.lineWidth= .1
      this.ctx.strokeRect(bbox.minx, bbox.miny, bbox.maxx-bbox.minx, bbox.maxy - bbox.miny)

      this.ctx.lineWidth = .2

      for(i=0; i<vertices.length; i++){
        this.dot(vertices[i].x, vertices[i].y)
      }

      for(i=0; i<edges.length; i++){
        this.drawEdge(edges[i])
      }

    }
  }
}
