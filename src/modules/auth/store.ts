import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Student, Teacher } from '@/models'
import { studentInstance } from '@/http'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

export const useAuth = defineStore('auth-store', () => {
	const studentInfo = ref<Student>()
	const router = useRouter()

	async function register(data: { fullname: string; password: string; classroomOneId?: string }) {
		try {
			const response = await studentInstance.post('/register', data)

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			Cookies.set('token', response.data.token)
			Cookies.set('oneId', response.data.student.oneId)
			Cookies.set('beta-component', 'true')
			studentInfo.value = response.data.student
			toast(response.data.msg)
			await router.push('/')
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function login(data: { oneId: string; password: string; classroomOneId?: string }) {
		try {
			const response = await studentInstance.post('/login', data)

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			Cookies.set('token', response.data.token)
			Cookies.set('oneId', response.data.student.oneId)
			Cookies.set('beta-component', 'true')
			studentInfo.value = response.data.student
			toast(response.data.msg)
			await router.push('/')
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function check() {
		const token = Cookies.get('token')
		const oneId = Cookies.get('oneId')

		try {
			if (!token || !oneId) {
				await router.push('/auth')
				Cookies.remove('token')
				Cookies.remove('oneId')
				Cookies.remove('beta-component')
				toast('Boshqatdan tizimga kiring')
				return
			}

			const response = await studentInstance.get(`/check/${oneId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				await router.push('/auth')
				Cookies.remove('token')
				Cookies.remove('oneId')
				Cookies.remove('beta-component')
				return
			}

			if (response.data.status === 'ok') {
				Cookies.set('token', response.data.token)
				Cookies.set('oneId', response.data.student.oneId)
				studentInfo.value = response.data.student
			}
		} catch (error: any) {
			console.log(error)
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	return {
		studentInfo,
		register,
		check,
		login,
	}
})
