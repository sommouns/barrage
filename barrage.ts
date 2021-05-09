let isPaused = true;
interface IProps {
  fontSize: number;
  color: string;
  speed: number;
}
type IBarrageText = Partial<IProps> & {
  text: string;
  time: number;
};
class CanvasBarrage {
  videoDom!: HTMLVideoElement;
  canvasDom!: HTMLCanvasElement;
  height: number;
  width: number;
  canvas: CanvasRenderingContext2D;
  defaultProps: Partial<IProps>;
  data: IBarrageText[];
  barrage: Barrage[] = [];
  constructor(
    videoDom: HTMLVideoElement,
    canvasDom: HTMLCanvasElement,
    options: Partial<IProps>,
    data: IBarrageText[] = []
  ) {
    this.videoDom = videoDom;
    this.canvasDom = canvasDom;
    this.height = videoDom.clientHeight;
    this.width = videoDom.clientWidth;
    this.canvas = canvasDom.getContext("2d")!;
    this.defaultProps = {
      fontSize: 16,
      color: "#000000",
      speed: 1,
    };
    this.data = data;
    Object.assign(this.defaultProps, options);
    this.init();
  }

  init() {
    this.canvasDom.style.height = this.height - 80 + "px";
    this.canvasDom.style.width = this.width + "px";

    this.barrage = this.data.map((item) => {
      return new Barrage({ ...this.defaultProps, ...item }, this.canvas);
    });

    this.videoDom.addEventListener("play", (e) => {
      isPaused = false;
      this.render()
    });
    this.videoDom.addEventListener("pause", (e) => {
      isPaused = true;
    });
    requestAnimationFrame(this.render.bind(this));
  }

  render() {
    // clear canvas
    if (isPaused) {
      return
    }
    this.canvas.clearRect(0, 0, this.height, this.width);
    let currentTime = this.videoDom.currentTime;
    this.barrage.forEach((barrage) => {
      if (barrage.info.time <= currentTime) {
        if (!barrage.isInited) {
          barrage.init();
        }

        barrage.render()
      }
    });

    requestAnimationFrame(this.render.bind(this));
  }

  add(data: IBarrageText) {
    this.barrage.push(new Barrage({ ...this.defaultProps, ...data }, this.canvas))
  }
}

class Barrage {
  public isInited: boolean = false;
  public info!: IBarrageText;
  x!: number;
  y!: number;
  opacity: number = 0;
  width!: number;
  ctx!: CanvasRenderingContext2D;
  constructor(props: IBarrageText, context: CanvasRenderingContext2D) {
    this.info = props;
    this.ctx = context;
  }
  init() {
    this.calaculateInitPosition();
    this.isInited = true;
  }

  calaculateInitPosition() {
    let span = document.createElement("span");
    span.innerHTML = this.info.text;
    span.style.position = "absolute";
    span.style.opacity = "0";
    document.body.appendChild(span);
    this.width = span.clientWidth;
    document.body.removeChild(span);

    this.x = this.ctx.canvas.width;
    this.y = this.ctx.canvas.height * Math.random();

    if (this.y < this.info.fontSize!) {
      this.y = this.info.fontSize!;
    }

    if (this.y > this.ctx.canvas.height - this.info.fontSize!) {
      this.y = this.ctx.canvas.height - this.info.fontSize!;
    }
  }

  render() {
    this.x -= this.info.speed!
    this.ctx.font = this.info.fontSize + "px Microsoft Yahei";
    this.ctx.fillStyle = this.info.color!;
    this.ctx.fillText(this.info.text, this.x, this.y);
  }
}
