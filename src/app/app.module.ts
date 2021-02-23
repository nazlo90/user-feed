import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { FeedService } from './services/feed.service';
import { FeedWebService } from './web-services/feed.web.service';
import { UploadImageComponent } from './components/post-form/component/upload-image/upload-image.component';
import { DrawImageComponent } from './components/post-form/component/draw-image/draw-image.component';
import { OrderByPipeModule } from './pipes/order-by-pipe.module';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    PostFormComponent,
    UploadImageComponent,
    DrawImageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    OrderByPipeModule
  ],
  providers: [
    HttpClientModule,
    FeedService,
    FeedWebService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
