export class Scanner {
  static readonly EOF = undefined;

  text: string;
  start = 0;
  position = -1;

  constructor(jsonpath: string) {
    this.text = jsonpath;
  }

  next(): string | undefined {
    if (this.hasNext()) {
      this.position++;
      return this.text.charAt(this.position);
    } else {
      return undefined;
    }
  }

  nextOrError(): string {
    return this.orError(this.next());
  }

  take(length: number): string {
    const result = this.text.slice(this.position + 1, this.position + 1 + length);
    this.position += length;
    return result;
  }

  takeOrError(length: number): string {
    return this.orError(this.take(length));
  }

  back() {
    this.position--;
  }

  peek(): string | undefined {
    if (this.hasNext()) {
      return this.text.charAt(this.position + 1);
    } else {
      return undefined;
    }
  }

  peekOrError(): string {
    return this.orError(this.peek());
  }

  consume({ trim }: { trim?: number } = {}): string {
    const value = this.text.slice(this.start, this.position + 1);
    this.start = this.position + 1;
    if (trim != null) {
      return value.slice(0, value.length - trim);
    } else {
      return value;
    }
  }

  hasNext(): boolean {
    const nextPosition = this.position + 1;
    return nextPosition < this.text.length;
  }

  private orError(result: string | undefined): string {
    if (result === Scanner.EOF) {
      throw new Error('Unexpected EOF reached');
    } else {
      return result;
    }
  }
}
