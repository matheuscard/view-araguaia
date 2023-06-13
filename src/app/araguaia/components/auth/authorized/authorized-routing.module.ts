import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthorizedComponent } from './authorized.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AuthorizedComponent }
	])],
	exports: [RouterModule]
})
export class AuthorizedRoutingModule { }
