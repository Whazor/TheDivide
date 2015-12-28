module Game {
  var c = <HTMLCanvasElement> document.getElementById("canvas");
  export function draw() {

    var ctx = c.getContext("2d");
    ctx.moveTo(0,0);
    ctx.lineTo(200,100);
    ctx.stroke();

  }
}


$(function(){

  var c = <HTMLCanvasElement> document.getElementById("canvas");
  var ctx = c.getContext("2d");
  ctx.moveTo(0,0);
  ctx.lineTo(200,100);
  ctx.stroke();

  setTimeout(function(){
    ctx.moveTo(100,100);
    ctx.lineTo(200,100);
    ctx.stroke();
  }, 1000);

});
