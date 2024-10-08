import Cookies from 'js-cookie'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/auth',
		name: 'auth-layout',
		component: () => import('@/layouts/auth-layout.vue'),
		beforeEnter: (to, from, next) => {
			const token = Cookies.get('token')
			const oneId = Cookies.get('oneId')
			if (token || oneId) {
				next('/')
			} else {
				next()
			}
		},
		children: [
			{
				path: '',
				name: 'auth-main',
				component: () => import('../pages/auth-page.vue'),
			},
		],
	},
	{
		path: '/',
		component: () => import('@/layouts/default-layout.vue'),
		name: 'default-layout',
		redirect: '/classrooms',
		beforeEnter: (to, from, next) => {
			const token = Cookies.get('token')
			const oneId = Cookies.get('oneId')
			if (!token || !oneId) {
				next('/auth')
			} else {
				next()
			}
		},
		children: [
			{
				path: 'classrooms',
				name: 'default-classrooms',
				component: () => import('../pages/classrooms-page.vue'),
			},
			{
				path: 'classrooms/:oneId',
				name: 'default-classroom',
				component: () => import('../pages/single-classroom-page.vue'),
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export default router
