module TD {
  export class Soldier implements TD.Position, TD.BoundingBox, TD.Draw {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;

    constructor() {
      this.x = 100;
      this.y = 100;
      this.width = 30;
      this.height = 30;

      this.image = <HTMLImageElement>document.getElementById("imgSoldier");
    }
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
  }
}
