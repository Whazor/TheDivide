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

    // stomme zooi
    l.point1 = new Position();
    l.point1.x = line.point1.x;
    l.point1.y = line.point1.y;
    l.point2 = new Position();
    l.point2.x = line.point2.x;
    l.point2.y = line.point2.y;

    // delen door nul maakt meer kapot dan je lief is
    if (l.point1.x - l.point2.x == 0) {
      l.point1.y = 0;
      l.point2.y = height;
      return l;
    }

    // reken slope uit
    var slope = (l.point1.y - l.point2.y) / (l.point1.x - l.point2.x);

    // TODO: hier magie die de lijn langer maakt

    // terugkeren
    return l;
  }
}
