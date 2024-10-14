import Cookies from 'js-cookie'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { toast } from 'vue-sonner'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/auth',
		name: 'auth-layout',
		component: () => import('@/layouts/auth-layout.vue'),

		beforeEnter: (to, from, next) => {
			const token = Cookies.get('token')
			const oneId = Cookies.get('oneId')
			const examOneId = Cookies.get('examOneId')

			if (token && oneId) {
				next('/')
			}
			if (examOneId) {
				next('/exam')
			} else {
				Cookies.remove('examOneId')
				Cookies.remove('oneId')
				Cookies.remove('token')
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
			const examOneId = Cookies.get('examOneId')

			if (!token || !oneId) {
				next('/auth')
			}
			if (examOneId) {
				next(`/exam/${examOneId}`)
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
			{
				path: 'profile',
				name: 'default-profile',
				component: () => import('../pages/profile-page.vue'),
			},
		],
	},
	{
		path: '/exam',
		component: () => import('@/layouts/exam-layout.vue'),
		name: 'exam-layout',
		redirect: ':oneId',
		beforeEnter: (to, from, next) => {
			const token = Cookies.get('token')
			const oneId = Cookies.get('oneId')
			const examOneId = Cookies.get('examOneId')
			if (!examOneId || examOneId !== to.params.oneId) {
				Cookies.remove('examOneId')
				toast("Imtihonga kirishga sizda ruxsat yo'q")
				next('/')
			}
			if (!token || !oneId) {
				next('/auth')
			} else {
				next()
			}
		},
		children: [
			{
				path: ':oneId',
				name: 'exam-single-exam',
				component: () => import('../pages/exam-page.vue'),
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export default router
