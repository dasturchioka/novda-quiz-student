<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useExam } from '@/modules/exam/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAuth } from '@/modules/auth/store'
import AskBeforeAction from '@/components/app/ask-before-action.vue'

const route = useRoute()
const authStore = useAuth()
const examStore = useExam()

const { currentExam, currentExamQuestions } = storeToRefs(examStore)

onMounted(async () => {
	const examOneId = route.params.oneId as string
	await authStore.check()
	await examStore.checkStatus({ examOneId })

	// Load saved answers from sessionStorage, if any
	const savedAnswers = sessionStorage.getItem('userAnswers')
	if (savedAnswers) {
		userAnswers.value = JSON.parse(savedAnswers)
	}
})

const currentQuestionIndex = ref(0)

// Store answers with questionId and selectedAnswer
const userAnswers = ref<{ questionId: string; selectedAnswer: string }[]>([])

const currentQuestion = computed(
	() => currentExamQuestions.value?.questions?.[currentQuestionIndex.value] || null
)

const progress = computed(
	() => ((currentQuestionIndex.value + 1) / currentExamQuestions.value.questions.length) * 100
)

// Sync userAnswers to sessionStorage whenever it changes
watch(
	userAnswers,
	newValue => {
		sessionStorage.setItem('userAnswers', JSON.stringify(newValue))
	},
	{ deep: true }
)

// Get or set selected answer for the current question using its ID
const selectedAnswer = computed({
	get: () => {
		const answer = userAnswers.value.find(ans => ans.questionId === currentQuestion.value?.id)
		return answer ? answer.selectedAnswer : ''
	},
	set: (value: string) => {
		const existingAnswer = userAnswers.value.find(
			ans => ans.questionId === currentQuestion.value?.id
		)
		if (existingAnswer) {
			existingAnswer.selectedAnswer = value
		} else {
			userAnswers.value.push({
				questionId: currentQuestion.value!.id,
				selectedAnswer: value,
			})
		}
	},
})

const selectAnswer = (option: string) => {
	selectedAnswer.value = option
}

const nextQuestion = () => {
	if (currentQuestionIndex.value < currentExamQuestions.value.questions.length - 1) {
		currentQuestionIndex.value++
	}
}

const previousQuestion = () => {
	if (currentQuestionIndex.value > 0) {
		currentQuestionIndex.value--
	}
}

const submitQuiz = async () => {
	const userAnswersSession = sessionStorage.getItem('userAnswers')
	if (userAnswersSession) {
		const userAnswers = JSON.parse(userAnswersSession)
		await examStore.submitExam({
			answers: userAnswers,
			examOneId: currentExam.value?.oneId as string,
		})
		sessionStorage.removeItem("userAnswers")
	}
}
</script>

<template>
	<div class="min-h-screen bg-gray-100 flex flex-col">
		<header class="bg-blue-600 text-white p-4">
			<h1 class="text-2xl font-bold">Online Exam</h1>
		</header>

		<main v-if="currentQuestion" class="flex-grow flex flex-col items-center justify-center p-4">
			<div class="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
				<div class="p-6">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-2xl font-semibold">
							Question {{ currentQuestionIndex + 1 }} of {{ currentExamQuestions.questions.length }}
						</h2>
						<Progress v-model="progress" class="w-1/3" />
					</div>

					<p class="text-lg mb-4">{{ currentQuestion.questionText }}</p>

					<img
						v-if="currentQuestion.img"
						:src="currentQuestion.img"
						:alt="`Question ${currentQuestionIndex + 1}`"
						class="w-full mb-4 rounded-lg"
					/>

					<div class="space-y-4">
						<button
							v-for="option in ['A', 'B', 'C', 'D']"
							:key="option"
							@click="
								selectAnswer(
									currentQuestion[
										`option${option}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'
									]
								)
							"
							class="border w-full h-auto rounded-md min-h-[4rem] py-3 px-4 text-left flex items-start transition-all"
							:class="{
								'bg-blue-500 border-blue-500 text-neutral-50 shadow hover:bg-blue-400':
									selectedAnswer ===
									currentQuestion[`option${option}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'],
								'border-neutral-200 bg-white shadow-sm hover:bg-neutral-100':
									selectedAnswer !==
									currentQuestion[`option${option}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'],
							}"
						>
							<p>
								<span class="font-bold">{{ option }}.</span>
								{{
									currentQuestion[
										`option${option}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'
									]
								}}
							</p>
						</button>
					</div>
				</div>

				<div class="bg-gray-100 px-6 py-4 flex justify-between items-center">
					<Button
						@click="previousQuestion"
						:disabled="currentQuestionIndex === 0"
						variant="outline"
					>
						Oldingi
					</Button>
					<Button
						v-if="currentQuestionIndex < currentExamQuestions.questions.length - 1"
						@click="nextQuestion"
						:disabled="!selectedAnswer"
						variant="default"
					>
						Keyingi
					</Button>
					<AskBeforeAction
						v-if="currentQuestionIndex === currentExamQuestions.questions.length - 1"
						title="Tugatamizmi?"
						description="Natijalaringiz faqat o'qituvchingizga ko'rinadi"
						@do:action="submitQuiz"
					>
						<template #trigger>
							<Button :disabled="!selectedAnswer" variant="default"> Tugatish </Button>
						</template>
					</AskBeforeAction>
				</div>
			</div>
			<AskBeforeAction
				title="Erta tugatamizmi?"
				description="Shu yergacha ishlagan natijalaringiz faqat o'qituvchingizga ko'rinadi"
				@do:action="submitQuiz"
			>
				<template #trigger>
					<Button :disabled="!selectedAnswer" variant="destructive" class="my-4">
						Erta tugatish
					</Button>
				</template>
			</AskBeforeAction>
		</main>
	</div>
</template>
