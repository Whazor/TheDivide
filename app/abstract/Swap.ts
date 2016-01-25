module TD {
  export function swap(first: Position, second: Position) {
    var a, b;
    a = first.x;
    b = first.y;
    first.x = second.x;
    first.y = second.y;
    second.x = a;
    second.y = b;
  }
  export function extendLine(line: Line, width: number, height: number): Line {
    var l = new Line();

    // init
    l.point1 = new Position();
    l.point2 = new Position();


    // delen door nul maakt meer kapot dan je lief is
    if (l.point1.x - l.point2.x == 0) {
      l.point1.y = 0;
      l.point2.y = height;
      return l;
    }

    // reken slope uit
    var slope = (line.point1.y - line.point2.y) / (line.point1.x - line.point2.x);


    var heightatyaxis = line.point1.y  - line.point1.x *slope

    l.point1.x = 0
    l.point1.y = heightatyaxis
    l.point2.x = width
    l.point2.y = heightatyaxis + width * slope

    return l;
  }
}
