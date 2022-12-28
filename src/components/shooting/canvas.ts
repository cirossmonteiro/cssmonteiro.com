const PLAYER_RADIUS = 10;
const AIM_FACTOR = 1.3;



class Canvas {
  ctx: any;
  width: number;
  height: number;
  player: [number, number];

  constructor(ctx: any, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.player = [width/2, height/2];
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  computeMouseCoordinates = (x: number, y: number) => [
    x*this.width,
    y*this.height
  ]

  isInsideTarget = (mouse: [number, number], target: [number, number]) => {
    const [x, y] = this.computeMouseCoordinates(mouse[0], mouse[1]);
    const [tx, ty] = this.computeMouseCoordinates(target[0], target[1]);
    return ((x-tx)**2+(y-ty)**2)**0.5 < 3*PLAYER_RADIUS;
  }

  renderAim = (x: number, y: number) => {
    const center = this.computeMouseCoordinates(x,y)
    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.moveTo(center[0]-AIM_FACTOR*PLAYER_RADIUS, center[1])
    this.ctx.lineTo(center[0]+AIM_FACTOR*PLAYER_RADIUS, center[1])
    this.ctx.moveTo(center[0], center[1]-AIM_FACTOR*PLAYER_RADIUS)
    this.ctx.lineTo(center[0], center[1]+AIM_FACTOR*PLAYER_RADIUS)
    this.ctx.stroke();
  }

  renderTarget = (x: number, y: number) => {
    const center = this.computeMouseCoordinates(x,y)
    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.arc(center[0], center[1], 3*PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  renderPlayer = (x: number, y: number) => {
    [x,y] = this.computeMouseCoordinates(x,y);
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(x-1.5*PLAYER_RADIUS, y-1.5*PLAYER_RADIUS, 3*PLAYER_RADIUS, 3*PLAYER_RADIUS);
  }

  render = (mouse: [number, number], target: [number, number]) => {
    this.clear()
    // this.renderPlayer(x, y);
    this.renderAim(...mouse);
    this.renderTarget(...target);
    
  }
}

export default Canvas;