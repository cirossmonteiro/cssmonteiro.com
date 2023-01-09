const PLAYER_RADIUS = 10;
const AIM_FACTOR = 1.3;

type TPoint = [number, number];

const euclidean = (x: TPoint, y: TPoint) => {
  return ((x[0]-y[0])**2+(x[1]-y[1])**2)**0.5;
}

const elliptical = (x: TPoint, y1: TPoint, y2: TPoint) => {
  return euclidean(x, y1) + euclidean(x, y2);
}

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

  computeMouseCoordinates = (x: number, y: number): TPoint => [
    x*this.width,
    y*this.height
  ]

  isInsideTargetHead = (mouse: [number, number], target: [number, number]) => {
    const [x, y] = this.computeMouseCoordinates(mouse[0], mouse[1]);
    const [tx, ty] = this.computeMouseCoordinates(target[0], target[1]);
    return ((x-tx)**2+(y-ty)**2)**0.5 < 3*PLAYER_RADIUS;
  }

  isInsideTargetBody = (mouse: [number, number], target: [number, number]) => {
    mouse = this.computeMouseCoordinates(mouse[0], mouse[1]);
    const center = this.computeMouseCoordinates(target[0], target[1]);
    const dx = Math.abs(mouse[0] - center[0]);
    const fitY = (center[1]+3*PLAYER_RADIUS - mouse[1])*(center[1]+12*PLAYER_RADIUS - mouse[1]) < 0;
    const dyExt = Math.min(Math.abs(mouse[1] - center[1]+3*PLAYER_RADIUS), Math.abs(mouse[1] - center[1]+12*PLAYER_RADIUS));
    console.log(47, dx, fitY, dyExt);
    return dx < 3 && (fitY || dyExt < 3);
  }

  isInsideTarget = (mouse: [number, number], target: [number, number]) => {
    return this.isInsideTargetHead(mouse, target)
        || this.isInsideTargetBody(mouse, target);
  }

  renderAim = (x: number, y: number) => {
    const center = this.computeMouseCoordinates(x,y);
    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.moveTo(center[0]-AIM_FACTOR*PLAYER_RADIUS, center[1]);
    this.ctx.lineTo(center[0]+AIM_FACTOR*PLAYER_RADIUS, center[1]);
    this.ctx.moveTo(center[0], center[1]-AIM_FACTOR*PLAYER_RADIUS);
    this.ctx.lineTo(center[0], center[1]+AIM_FACTOR*PLAYER_RADIUS);
    this.ctx.stroke();
  }

  renderTarget = (x: number, y: number) => {
    const center = this.computeMouseCoordinates(x,y);
    
    this.ctx.strokeStyle = "blue";
    this.ctx.fillStyle = "blue";

    // head
    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], 3*PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // left eyeball
    this.ctx.beginPath();
    this.ctx.arc(center[0]-PLAYER_RADIUS, center[1]-PLAYER_RADIUS, 0.8*PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.stroke();

    // left pupil
    this.ctx.beginPath();
    this.ctx.arc(center[0]-1.05*PLAYER_RADIUS, center[1]-PLAYER_RADIUS, 0.3*PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();

    // right eye
    this.ctx.beginPath();
    this.ctx.arc(center[0]+PLAYER_RADIUS, center[1]-PLAYER_RADIUS, 0.8*PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.stroke();

    // right pupil
    this.ctx.beginPath();
    this.ctx.arc(center[0]+1.05*PLAYER_RADIUS, center[1]-PLAYER_RADIUS, 0.3*PLAYER_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();

    // smile
    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1]+PLAYER_RADIUS, PLAYER_RADIUS, 0, Math.PI);
    this.ctx.fill();

    // body
    this.ctx.beginPath();
    this.ctx.moveTo(center[0], center[1]+3*PLAYER_RADIUS);
    this.ctx.lineTo(center[0], center[1]+12*PLAYER_RADIUS);
    this.ctx.stroke();

    // left arm
    this.ctx.beginPath();
    this.ctx.moveTo(center[0], center[1]+6*PLAYER_RADIUS);
    this.ctx.lineTo(center[0]-PLAYER_RADIUS, center[1]+10*PLAYER_RADIUS);
    this.ctx.stroke();

    // right arm
    this.ctx.beginPath();
    this.ctx.moveTo(center[0], center[1]+6*PLAYER_RADIUS);
    this.ctx.lineTo(center[0]+PLAYER_RADIUS, center[1]+10*PLAYER_RADIUS);
    this.ctx.stroke();

    // left leg
    this.ctx.beginPath();
    this.ctx.moveTo(center[0], center[1]+12*PLAYER_RADIUS);
    this.ctx.lineTo(center[0]-PLAYER_RADIUS, center[1]+16*PLAYER_RADIUS);
    this.ctx.stroke();

    // right leg
    this.ctx.beginPath();
    this.ctx.moveTo(center[0], center[1]+12*PLAYER_RADIUS);
    this.ctx.lineTo(center[0]+PLAYER_RADIUS, center[1]+16*PLAYER_RADIUS);
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