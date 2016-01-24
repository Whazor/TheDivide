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

      this.x = pos.x - Math.floor(this.width / 2);
      this.y = pos.y - Math.floor(this.height / 2);

      this.image = <HTMLImageElement>document.getElementById("imgMage");
    }
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (this.selected) {
        ctx.rect(this.x,this.y,this.width, this.height);
        ctx.stroke();
      }
    };
    select(selected:boolean) {
      this.selected = selected;
    }
    toString() {
      return this.x + '-' + this.y + '-' + this.type;
    }
  }
}
