import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostModel } from '../models/post.model';


@Injectable()
export class FeedWebService {
    private readonly uri: string = `http://localhost:3000/`;

    constructor(private http: HttpClient) { }

    getPosts(): Observable<PostModel[]> {
      return this.http.get<PostModel[]>(this.uri + 'get-posts');
    }

    addPost(newPost: PostModel): Observable<PostModel[]> {
      return this.http.post<PostModel[]>(this.uri + 'add-post', newPost);
    }

    removePost(id: string): Observable<PostModel[]> {
      return this.http.post<PostModel[]>(this.uri + 'remove-post', id);
    }
}
