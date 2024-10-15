import { studentInstance } from '@/http'
import { Classroom } from '@/models'
import Cookies from 'js-cookie'
import { Boxes, Diamond, User } from 'lucide-vue-next'
import { defineStore } from 'pinia'
import { Component, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useRoute,useRouter } from 'vue-router'

interface NavItem {
	href: string
	label: string
	icon: Component
	isOpen: boolean
	children?: NavItem[]
}

export const useClassrooms = defineStore('classrooms-store', () => {
	const classrooms = ref<Classroom[]>()
	const classroom = ref<Classroom>()
	const navItems = ref<NavItem[]>()
	const route = useRoute()
	const router = useRouter()

	async function getClassrooms() {
		try {
			const oneId = Cookies.get('oneId')

			const response = await studentInstance.get(`/get-classrooms/${oneId}`)

			if (!response) {
				toast('Internet yoki server bilan aloqa mavjud emass')
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			classrooms.value = data.classrooms

			navItems.value = [
				{
					href: '/classrooms/',
					label: 'Sinfxonalar',
					icon: Boxes,
					isOpen: route.path.includes('/classrooms/'),
					children: data.classrooms.length
						? data.classrooms.map((c: Classroom) => {
								return {
									href: `/classrooms/${c.oneId}`,
									label: c.name,
									icon: Diamond,
								}
						  })
						: null,
				},
				{ href: '/profile', label: 'Profil', icon: User, isOpen: false },
			]
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}
	async function getClassroom(classroomOneId: string) {
		try {
			const oneId = Cookies.get('oneId')

			const response = await studentInstance.get(
				`/get-classroom/${oneId}?classroomOneId=${classroomOneId}`
			)

			if (!response) {
				toast('Internet yoki server bilan aloqa mavjud emass')
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(response.data.msg)
				await router.push("/")
				return
			}

			classroom.value = data.classroom
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}
	async function leaveClassroom(classroomOneId: string) {
		try {
			const oneId = Cookies.get('oneId')

			const response = await studentInstance.put(
				`/leave-classroom/${oneId}?classroomOneId=${classroomOneId}`
			)

			if (!response) {
				toast('Internet yoki server bilan aloqa mavjud emass')
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			classroom.value = {} as Classroom
			await getClassrooms()
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}
	async function enterClassroom(classroomOneId: string) {
		try {
			const oneId = Cookies.get('oneId')

			const response = await studentInstance.put(
				`/enter-classroom/${oneId}?classroomOneId=${classroomOneId}`
			)

			if (!response) {
				toast('Internet yoki server bilan aloqa mavjud emass')
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			classroom.value = data.classroom
			await getClassrooms()
			await router.push(`/classrooms/${data.classroom.oneId}`)
			toast(response.data.msg)
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	return {
		classrooms,
		getClassrooms,
		navItems,
		getClassroom,
		classroom,
		leaveClassroom,
		enterClassroom,
	}
})
