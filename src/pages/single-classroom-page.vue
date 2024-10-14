<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useClassrooms } from '@/modules/classrooms/store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { ClipboardIcon, LogOut, UserIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AskBeforeAction from '@/components/app/ask-before-action.vue'
import Cookies from 'js-cookie'
import BackButton from '@/components/app/back-button.vue'
import { useLoading } from '@/globals/loading'
import Loading from '@/components/app/loading.vue'
import { useExam } from '@/modules/exam/store'

const examStore = useExam()
const loadingStore = useLoading()
const classroomsStore = useClassrooms()

const { loading } = storeToRefs(loadingStore)
const { classroom } = storeToRefs(classroomsStore)

const route = useRoute()
const router = useRouter()

onMounted(async () => {
	const oneId = route.params.oneId
	await classroomsStore.getClassroom(String(oneId))
})

const leaveClassroom = async () => {
	await classroomsStore.leaveClassroom(String(route.params.oneId))
	await router.push('/classrooms/')
}

const enterExam = async (examOneId: string) => {
	console.log(examOneId)
	const classroomOneId = route.params.oneId as string
	await examStore.enterExam({ classroomOneId, examOneId })
}
</script>

<template>
	<Loading v-if="loading && !classroom" />
	<div v-else-if="classroom && !loading" class="min-h-screen flex">
		<!-- Main content -->
		<main class="flex flex-col flex-grow py-2 overflow-y-auto">
			<BackButton />
			<header
				class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 mb-6 text-white shadow"
			>
				<h2 class="text-3xl font-bold">{{ classroom.name }}</h2>
			</header>
			<!-- Exams section -->
			<section class="bg-white rounded-lg shadow p-6 border mb-6">
				<div>
					<h3 class="text-xl font-semibold text-gray-800">Imtihonlar</h3>
					<p class="text-neutral-400 text-sm mb-4">
						{{
							classroom.exams || classroom.exams.length
								? `${classroom.exams.length} ta imtihon`
								: ''
						}}
					</p>
				</div>
				<div
					v-if="!classroom.exams || classroom.exams.length === 0"
					class="text-center py-8 bg-gray-50 rounded-lg"
				>
					<ClipboardIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
					<p class="text-gray-600">Hali imtihonlar mavjud emas</p>
				</div>
				<ul v-else class="space-y-2">
					<li
						v-for="exam in classroom.exams"
						:key="exam.name"
						class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition duration-150 ease-in-out"
					>
						<div class="flex items-center justify-between flex-wrap space-y-4">
							<div>
								<h4 class="text-lg font-medium text-gray-800">{{ exam.name }}</h4>
								<p class="text-gray-600">
									Savollar paketi: <b>{{ exam.packageOfExam }}</b>
								</p>
							</div>
							<div class="text-right">
								<p class="text-sm text-gray-500">Imtihondagi talabalar</p>
								<p class="text-2xl font-bold text-indigo-600">{{ exam.studentsCount }}</p>
							</div>
						</div>
						<div class="mt-4 flex justify-end space-x-2">
							<Button
								v-if="exam.active"
								@click="enterExam(exam.oneId)"
								class="bg-blue-500 hover:bg-blue-500"
							>
								Kirish
							</Button>
							<Button v-else class="bg-blue-500 hover:bg-blue-500"> Natijalarni olish </Button>
						</div>
					</li>
				</ul>
			</section>
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<!-- Teacher section -->
				<section class="bg-white rounded-lg shadow p-6 border h-auto">
					<h3 class="text-xl font-semibold text-gray-800 mb-4">Domla</h3>
					<div class="flex items-center">
						<div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
							<UserIcon class="w-8 h-8 text-indigo-500" />
						</div>
						<div>
							<h4 class="text-lg font-medium text-gray-800">{{ classroom.teacher }}</h4>
						</div>
					</div>
				</section>

				<!-- Students section -->
				<section class="bg-white rounded-lg shadow p-6 lg:col-span-2 border">
					<div>
						<h3 class="text-xl font-semibold text-gray-800">Talabalar</h3>
						<p class="text-neutral-400 text-sm mb-4">
							{{
								classroom.students && classroom.students.length
									? `${classroom.students.length} nafar talaba`
									: ''
							}}
						</p>
					</div>
					<div class="max-h-[300px] overflow-y-auto">
						<ul class="space-y-2">
							<li
								v-for="(student, index) in classroom.students"
								:key="index"
								class="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition duration-150 ease-in-out"
							>
								<div class="flex items-center">
									<div
										class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
									>
										<UserIcon class="w-5 h-5 text-blue-500" />
									</div>
									<span class="text-gray-800"
										>{{ student.fullname }}
										<b>{{ student.oneId === Cookies.get('oneId') ? `(Siz)` : '' }}</b></span
									>
								</div>
							</li>
						</ul>
					</div>
				</section>
			</div>
			<AskBeforeAction
				@do:action="leaveClassroom"
				class="self-end"
				:description="`${classroom.name} sinfxonasini tark etyabsiz`"
			>
				<template #trigger>
					<Button variant="destructive" class="my-4"><LogOut class="size-5 mr-2" /> Chiqish</Button>
				</template>
			</AskBeforeAction>
		</main>
	</div>
</template>
