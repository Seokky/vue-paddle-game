class ShapesDrawer {
  private ctx = null as CanvasRenderingContext2D | null;

  public init(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  private get context() {
    if (!this.ctx) {
      throw new AppError('GIVE ME FUCKING CONTEXT');
    }

    return this.ctx;
  }

  public async fillCircle(x: number, y: number, radius: number, color: string) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  public async fillRect(x: number, y: number, w: number, h: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
}

const shapesDrawer = new ShapesDrawer();

export { shapesDrawer };
