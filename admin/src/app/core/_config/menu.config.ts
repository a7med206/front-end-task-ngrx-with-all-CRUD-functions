export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
				},

			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},


				{section: 'Applications'},
				{
					title: 'User Management',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-user-outline-symbol',
					submenu: [
						{
							title: 'Users',
							page: '/user-management/users'
						},
						{
							title: 'Roles',
							page: '/user-management/roles'
						},
						{
							title: 'Tasks',
							page: '/user-management/tasks'
						}
					]
				},


			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
