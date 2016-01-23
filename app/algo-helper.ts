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
}
