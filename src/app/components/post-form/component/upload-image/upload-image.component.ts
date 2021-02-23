import { Component, OnInit, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  @ViewChild('image') image!: ElementRef;

  @Input() resetImageSubj!: Subject<void>;

  @Output() onImageChange: EventEmitter<string> = new EventEmitter<string>();

  imageSrc: string = '';

  private readonly destroyedSubj: Subject<void> = new Subject<void>();
  private readonly destroyedObs: Observable<void> = this.destroyedSubj.asObservable();

  ngOnInit(): void {
    this.observeResetImage();
  }

  handleInputChange(event: DragEventInit & any): void {
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if(!file || !file.type.match(pattern)) {
      this.resetImage();
      return;
    };

    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private handleReaderLoaded(event: DragEventInit & any): void {
    const reader = event.target;

    this.imageSrc = reader.result;
    this.onImageChange.emit(reader.result);
  }

  private observeResetImage(): void {
    this.resetImageSubj
        .pipe(
            takeUntil(this.destroyedObs)
        ).subscribe(() => {
          this.resetImage();
        });
  }

  resetImage(): void {
    this.imageSrc = '';
    this.image.nativeElement.value = '';
    this.onImageChange.emit('');
  }
}
