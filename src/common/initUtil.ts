export class InitUtil {
  init(target: any, source: any): void {
    if (target && source) {
      Object.assign(target, source);
    }
  }
}
