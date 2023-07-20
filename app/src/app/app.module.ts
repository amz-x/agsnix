// Angular Modules
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// GraphQL Module
import { GraphQLModule } from './graphql/graphql.module';

// Components
import { AppComponent } from './app.component';
import { FileSystemBrowserComponent } from './components/filesystem-browser/filesystem-browser.component';

@NgModule({
  declarations: [
    AppComponent,
    FileSystemBrowserComponent
  ],
  imports: [
    GraphQLModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
