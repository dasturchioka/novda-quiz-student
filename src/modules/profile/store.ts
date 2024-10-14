import { studentInstance } from '@/http'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { Student } from '@/models'

export const useProfile = defineStore('profile-store', () => {
	const router = useRouter()

	const profile = ref<Student>()

	async function getProfile() {
		try {
			const response = await studentInstance.get(`/get-profile/${Cookies.get('oneId')}`)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				Cookies.remove('oneId')
				Cookies.remove('token')
				await router.push('/auth')
				return
			}

			const data = await response.data

			profile.value = data.profile
			return
		} catch (error: any) {
			toast(error.message || error.response.data.msg || 'Nimadir xato ketdi')
		}
	}

	return { getProfile, profile }
})
