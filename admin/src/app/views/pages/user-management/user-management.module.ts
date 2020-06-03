// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { UserManagementComponent } from './user-management.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RoleEditDialogComponent } from './roles/role-edit/role-edit.dialog.component';
import { UserRolesListComponent } from './users/_subs/user-roles/user-roles-list.component';
import { ChangePasswordComponent } from './users/_subs/change-password/change-password.component';
import { AddressComponent } from './users/_subs/address/address.component';
import { SocialNetworksComponent } from './users/_subs/social-networks/social-networks.component';
import { TasksListComponent } from './tasks/task-list/tasks-list.component';
import { TaskEditComponent } from './tasks/task-edit/tasks-edit.component';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import {
	usersReducer,
	UserEffects,
	TasksReducer,
	TasksEffects,
	TaskService
} from '../../../core/auth';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
			},
			{
				path: 'roles',
				component: RolesListComponent
			},
			{
				path: 'users',
				component: UsersListComponent
			},
			{
				path: 'users:id',
				component: UsersListComponent
			},
			{
				path: 'users/add',
				component: UserEditComponent
			},
			{
				path: 'users/add:id',
				component: UserEditComponent
			},
			{
				path: 'users/edit',
				component: UserEditComponent
			},
			{
				path: 'users/edit/:id',
				component: UserEditComponent
			},
			{
				path: 'tasks',
				component: TasksListComponent
			},
			{
				path: 'tasks:id',
				component: TasksListComponent
			},
			{
				path: 'tasks/add',
				component: TaskEditComponent
			},
			{
				path: 'tasks/add:id',
				component: TaskEditComponent
			},
			{
				path: 'tasks/edit',
				component: TaskEditComponent
			},
			{
				path: 'tasks/edit/:id',
				component: TaskEditComponent
			},
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('users', usersReducer),
		EffectsModule.forFeature([UserEffects]),
		StoreModule.forFeature('Tasks', TasksReducer),
		EffectsModule.forFeature([TasksEffects]),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule
	],
	providers: [
		InterceptService,
	
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		TaskService
	],
	entryComponents: [
		ActionNotificationComponent,
		RoleEditDialogComponent
	],
	declarations: [
		UserManagementComponent,
		UsersListComponent,
		UserEditComponent,
		RolesListComponent,
		RoleEditDialogComponent,
		UserRolesListComponent,
		ChangePasswordComponent,
		AddressComponent,
		SocialNetworksComponent,
		TasksListComponent,
		TaskEditComponent
	]
})
export class UserManagementModule {}
