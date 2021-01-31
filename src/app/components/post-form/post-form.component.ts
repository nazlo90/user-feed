import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import * as _ from 'lodash';

import { DEFAULT_POST_MODEL, updateDefaultPostModelDate } from '../../constants';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent {
  @ViewChild('postForm') postForm!: FormGroup;

  showCanvas = true;
  postModel = _.cloneDeep(DEFAULT_POST_MODEL);
  saveImageSubj: Subject<void> = new Subject();
  resetImageSubj: Subject<void> = new Subject();

  constructor(readonly feedService: FeedService) { }

  onShowCanvasChange(value: boolean): void {
    this.showCanvas = value;
    this.postModel.image = '';
  }

  onSubmit(): void {
    if(this.showCanvas)
      this.saveImage();

    this.feedService.addNewPost(this.postModel);
    this.resetForm();
  }

  private resetForm(): void {
    updateDefaultPostModelDate();
    this.postModel = _.cloneDeep(DEFAULT_POST_MODEL);
    this.resetImageSubj.next();
    this.markControlsAsPristine();
  }

  private saveImage(): void {
    this.saveImageSubj.next();
  }

  private markControlsAsPristine(): void {
    Object.keys(this.postForm.controls).forEach((key) => {
      this.postForm.controls[key].markAsPristine();
    })
  }
}
