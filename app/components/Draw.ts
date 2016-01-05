module TD {
  export interface Draw {
    draw(ctx:CanvasRenderingContext2D);
    select(selected:boolean);
  }
}
