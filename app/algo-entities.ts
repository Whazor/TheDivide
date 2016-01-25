module Algo{
  export class AlgoLine{
    //does not support vertical lines, but duality never yields vertical lines
    slope: number
    heightatyaxis: number
  }

  //Clases for DCEL
  export class Vertex extends TD.Position{
    incidentEdge: Halfedge //Some Halfedge leaving this vertex

    constructor(x, y){
      super()
      this.x =x
      this.y =y
      //console.log("creating vertex at ",x ,y)
    }
  }

  export class AlgoBoundingBox{
    minx:number
    maxx:number
    miny:number
    maxy:number

    width():number{
      return this.maxx-this.minx
    }

    height():number{
      return this.maxy-this.miny
    }
  }

  export class Halfedge{
    fromvertex: Vertex
    tovertex: Vertex
    twin: Halfedge
    prev: Halfedge
    next: Halfedge
    incidentFace: Face //the unique incident face

    constructor(fromvertex, tovertex){
      this.fromvertex=fromvertex
      this.tovertex=tovertex

      //console.log("Creating edge from", fromvertex.x, fromvertex.y , "to", tovertex.x ,tovertex.y)

      if (this.length() == 0){
        console.error(this.fromvertex.x - this.tovertex.x, this.fromvertex.y - this.tovertex.y )
        throw Error("creating edge of length zero")
      }
    }

    length(){
      var dx = this.fromvertex.x - this.tovertex.x
      var dy = this.fromvertex.y - this.tovertex.y
      return Math.sqrt(dx*dx + dy*dy)
    }
  }


  export class Face{
    outerComponent: Halfedge
    //innerComponents: Array<Halfedge> Not nessecary in our case (Line arrangment)

    constructor(outerComponent){
      this.outerComponent = outerComponent
    }
  }

  export class PositionOnEdge{
    pos:TD.Position
    edge:Halfedge

    constructor(pos, edge){
      if (pos === undefined || edge=== undefined){
        throw "Undefined in constructor of PositionOnEdge"
      }
      this.pos = pos
      this.edge = edge
    }
  }

  export class DCEL{
    constructor(public vertices:Array<Vertex>, public edges:Array<Halfedge>, public faces:Array<Face>, public outerface:Face, public boundingBox:AlgoBoundingBox){    }
    //Q: Is the overarching structure necesarry?
  }

  export class Cut{
    constructor(public archerlines:Array<Array<AlgoLine>>,
                public soldierlines:Array<Array<AlgoLine>>,
                public magelines:Array<Array<AlgoLine>>,
                public solution:AlgoLine ){ }
  }

}
