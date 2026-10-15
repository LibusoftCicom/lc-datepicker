import { ComponentRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export class DynamicComponentLifecycle<T> {

  private readonly subscriptions = new Subscription();
  private destroyed = false;

  constructor(
    private readonly componentRef: ComponentRef<T>,
    private readonly detachView: () => void = () => undefined,
  ) {}

  public setInput(name: string, value: unknown): void {
    this.componentRef.setInput(name, value);
  }

  public detectChanges(): void {
    this.componentRef.changeDetectorRef.detectChanges();
  }

  public subscribe<TValue>(source: Observable<TValue>, handler: (value: TValue) => void): void {
    this.subscriptions.add(source.subscribe(handler));
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.subscriptions.unsubscribe();
    this.detachView();
    this.componentRef.destroy();
  }
}
