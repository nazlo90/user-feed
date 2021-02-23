import { Component, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent, Subject, Observable } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

@Component({
  selector: 'app-draw-image',
  templateUrl: './draw-image.component.html',
  styleUrls: ['./draw-image.component.scss']
})
export class DrawImageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;

  @Input() width: number = 400;
  @Input() height: number = 400;
  @Input() saveImage!: Subject<void>;

  @Output() onImageSave: EventEmitter<string> = new EventEmitter<string>();

  private cx!: CanvasRenderingContext2D;
  private isEmpty: boolean = true;

  private readonly destroyedSubj: Subject<void> = new Subject<void>();
  private readonly destroyedObs: Observable<void> = this.destroyedSubj.asObservable();

  ngOnInit() {
    this.observeSaveImage();
  }

  ngOnDestroy() {
    this.destroyedSubj.next();
		this.destroyedSubj.complete();
  }

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = <CanvasRenderingContext2D> canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              pairwise()
            )
        })
      )
      .subscribe((res: any) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) return;

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }

    if(this.isEmpty) this.isEmpty = false;
  }

  private save(): void {
    this.onImageSave.emit(this.canvas.nativeElement.toDataURL());

    this.clear();
  }

  private observeSaveImage(): void {
    this.saveImage
        .pipe(
            takeUntil(this.destroyedObs)
        ).subscribe(() => {
          if(!this.isEmpty)
            this.save();
        });
  }

  clear(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const context = <CanvasRenderingContext2D> canvasEl.getContext('2d');

    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    this.isEmpty = true;
  }
}
