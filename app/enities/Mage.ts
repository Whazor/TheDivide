module TD {
  export class Mage implements TD.Position, TD.BoundingBox, TD.Draw {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    selected = false;

    constructor(pos: TD.Position) {
      this.width = 30;
      this.height = 30;

      this.x = pos.x - Math.floor(this.width / 2);
      this.y = pos.y - Math.floor(this.height / 2);

      this.image = <HTMLImageElement>document.getElementById("imgMage");
    }
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (this.selected) {
        console.log("test");
        ctx.rect(this.x,this.y,this.width, this.height);
        ctx.stroke();
      }
    };
    select() {
      this.selected = !this.selected;
    }
  }
}
