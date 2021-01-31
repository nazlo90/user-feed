import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeedService } from '../../services/feed.service';
import { PostModel } from '../../models/post.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  private readonly destroyedSubj: ReplaySubject<void> = new ReplaySubject<void>();
  private readonly destroyedObs: Observable<void> = this.destroyedSubj.asObservable();

  constructor(readonly feedService: FeedService) { }

  ngOnInit(): void {
    this.loadPosts();
    this.observablePosts();
    this.observableAddNewPost();
    this.observableRemovePost();
  }

  ngOnDestroy() {
    this.destroyedSubj.next();
		this.destroyedSubj.complete();
  }

  private loadPosts(): void {
    this.feedService.loadTestingProceduresObs
      .pipe(
          takeUntil(this.destroyedObs)
      )
      .subscribe((loadPostsObs: Observable<PostModel[]>) => {
        loadPostsObs
          .pipe(
            takeUntil(this.destroyedObs)
          ).subscribe()
      })
  }

  private observablePosts(): void {
    this.feedService.postsObs
      .pipe(
          takeUntil(this.destroyedObs)
      )
      .subscribe()
  }

  private observableAddNewPost(): void {
    this.feedService.addNewPostObs
      .pipe(
          takeUntil(this.destroyedObs)
      )
      .subscribe((addNewPostsObs: Observable<PostModel[]>) => {
        addNewPostsObs
          .pipe(
            takeUntil(this.destroyedObs)
          ).subscribe()
      })
  }

  private observableRemovePost(): void {
    this.feedService.removePostObs
      .pipe(
          takeUntil(this.destroyedObs)
      )
      .subscribe((removePostsObs: Observable<PostModel[]>) => {
        removePostsObs
          .pipe(
            takeUntil(this.destroyedObs)
          ).subscribe()
      })
  }
}
