module TD {
  export class Range {
    private start: number;
    private end: number;

    constructor(start: number, end: number) {
      this.start = start;
      this.end = end;
    }

    constains(point: number): boolean {
      return this.start >= point && this.end <= point;
    }
  }
}
