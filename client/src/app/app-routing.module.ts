import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'demo',
        loadChildren: () =>
            import('./components/demo/demo.module').then((m) => m.DemoModule),
    },
    {
        path: '',
        loadChildren: () =>
            import('./components/landing-page/landing-page.module').then(
                (m) => m.LandingPageModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
