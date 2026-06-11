declare module 'sharp' {
  interface Sharp {
    resize(width: number, height: number): Sharp;
    png(): Sharp;
    webp(): Sharp;
    toBuffer(): Promise<Buffer>;
  }

  function sharp(input: Buffer | string): Sharp;
  export default sharp;
}
