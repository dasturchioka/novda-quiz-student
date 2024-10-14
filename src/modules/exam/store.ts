import { studentInstance } from '@/http'
import { Exam, Question } from '@/models'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

export const useExam = defineStore('exam-store', () => {
	const router = useRouter()

	const currentExam = ref<Exam>()
	const currentExamQuestions = ref<{ examOneId: string; questions: Question[] }>({
		examOneId: '',
		questions: [],
	})

	async function enterExam(payload: { classroomOneId: string; examOneId: string }) {
		try {
			const studentOneId = Cookies.get('oneId')
			const response = await studentInstance.put(`/enter-exam/${payload.examOneId}`, {
				studentOneId,
				classroomOneId: payload.classroomOneId,
			})

			if (!response) {
				toast("Server yoki internet bilan aloqa yo'q")
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			Cookies.set('examOneId', data.exam.oneId)
			currentExam.value = data.exam
			currentExamQuestions.value.examOneId = data.exam.oneId
			currentExamQuestions.value.questions = data.exam.questions
			toast(data.msg)
			await router.push(`/exam/${data.exam.oneId}`)
			return
		} catch (error: any) {
			toast(error.message || error.response.data.msg || 'Qandaydir xatolik yuzaga keldi')
			return
		}
	}

	async function checkStatus(payload: { examOneId: string }) {
		try {
			const studentOneId = Cookies.get('oneId')
			const response = await studentInstance.get(
				`/status-exam/${payload.examOneId}/${studentOneId}`
			)

			if (!response) {
				toast("Server yoki internet bilan aloqa yo'q")
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(data.msg)
				Cookies.remove('examOneId')
				await router.push('/')
				return
			}

			currentExam.value = data.exam
			currentExamQuestions.value.examOneId = data.exam.oneId
			currentExamQuestions.value.questions = data.exam.questions
		} catch (error: any) {
			toast(error.message || error.response.data.msg || 'Qandaydir xatolik yuzaga keldi')
			return
		}
	}

	async function submitExam(payload: {
		examOneId: string
		answers: { questionId: string; selectedAnswer: string }[]
	}) {
		try {
			const studentOneId = Cookies.get('oneId')
			const response = await studentInstance.put(
				`/submit-exam/${payload.examOneId}/${studentOneId}`,
				{ answers: payload.answers }
			)

			if (!response) {
				toast("Server yoki internet bilan aloqa yo'q")
				return
			}

			const data = await response.data

			toast(data.msg)
			Cookies.remove('examOneId')
			await router.push('/')
			return
		} catch (error: any) {
			console.log(error)
			toast(
				error.message || error.response.data.msg || "Xatolik yuz berdi, boshqatdan urinib ko'ring"
			)
		}
	}

	return { currentExam, currentExamQuestions, enterExam, checkStatus, submitExam }
})
