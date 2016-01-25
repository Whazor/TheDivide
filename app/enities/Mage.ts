module TD {
  export class Mage implements TD.Entity {
    type = EntityType.Mage;
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    selected = false;

    constructor(pos: TD.Position) {
      this.width = 100;
      this.height = 100;

      this.x = pos.x
      this.y = pos.y

      this.image = <HTMLImageElement>document.getElementById("imgMage");
    }
    draw(ctx) {
      ctx.drawImage(this.image,
                    this.x - Math.floor(this.width / 2),
                    this.y - Math.floor(this.height / 2),
                    this.width,
                    this.height);
      if (this.selected) {
        ctx.strokeStyle = "black"
        ctx.rect(this.x - Math.floor(this.width / 2),
                 this.y - Math.floor(this.height / 2),
                 this.width,
                 this.height);
        ctx.stroke();
      }
    }
    select(selected:boolean) {
      this.selected = selected;
    }
    toString() {
      return this.x + '-' + this.y + '-' + this.type;
    }
  }
}
