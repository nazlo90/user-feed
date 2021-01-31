import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PostModel } from '../models/post.model';
import { FeedWebService } from '../web-services/feed.web.service';


@Injectable()
export class FeedService {
  private readonly postsSubj: Subject<PostModel[]> = new Subject<PostModel[]>();
  postsObs: Observable<PostModel[]> = this.postsSubj.asObservable();

  loadTestingProceduresObs: Observable<Observable<PostModel[]>> = new BehaviorSubject(null).asObservable()
    .pipe(
      map(() => {
        return this.feedWebService.getPosts()
          .pipe(
            tap((posts: PostModel[]) => {
              this.postsSubj.next(posts);
            })
          )
      })
    )

  private readonly addNewPostSubj: Subject<PostModel> = new Subject<PostModel>();
  addNewPostObs: Observable<Observable<PostModel[]>> = this.addNewPostSubj.asObservable()
    .pipe(
      map((newPost: PostModel) => {
        return this.feedWebService.addPost(newPost)
          .pipe(
            tap((posts: PostModel[]) => {
              this.postsSubj.next(posts);
            })
          );
      })
    );

  private readonly removePostSubj: Subject<string> = new Subject<string>();
  removePostObs: Observable<Observable<PostModel[]>> = this.removePostSubj.asObservable()
    .pipe(
      map((id: string) => {
        return this.feedWebService.removePost(id)
          .pipe(
            tap((posts: PostModel[]) => {
              this.postsSubj.next(posts);
            })
          );
      })
    );

  constructor(
      private readonly feedWebService: FeedWebService
  ) { }

  loadPosts(posts: PostModel[]): void {
    this.postsSubj.next(posts);
  }

  addNewPost(newPost: PostModel): void {
    this.addNewPostSubj.next(newPost);
  }

  removePost(id: string): void {
    this.removePostSubj.next(id);
  }
}
