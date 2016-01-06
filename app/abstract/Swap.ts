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
}
