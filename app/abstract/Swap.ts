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
  export function extendLine(l: Line, height: number, width: number): Line {
    if (l.point1.x - l.point2.x == 0) {
      l.point1.y = 0;
      l.point2.y = height;
      return l;
    }

    var slope = (l.point1.y - l.point2.y) / (l.point1.x - l.point2.x);

    // TODO: hier magie die de lijn langer maakt

    return l;
  }
}
