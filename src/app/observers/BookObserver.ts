// bookswap-frontend/src/app/observers/BookObserver.ts
export interface Observer {
  update(data: any): void;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

export class BookObserverManager implements Subject {
  private static instance: BookObserverManager;
  private observers: Observer[] = [];

  private constructor() {}

  static getInstance(): BookObserverManager {
    if (!BookObserverManager.instance) {
      BookObserverManager.instance = new BookObserverManager();
    }
    return BookObserverManager.instance;
  }

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

export class BookListObserver implements Observer {
  constructor(private callback: (data: any) => void) {}

  update(data: any): void {
    this.callback(data);
  }
}
