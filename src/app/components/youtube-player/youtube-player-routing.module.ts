import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YoutubePlayerComponent } from './youtube-player.component';

const routes: Routes = [{ path: '', component: YoutubePlayerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YoutubePlayerRoutingModule {}
