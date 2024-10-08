<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Classroom } from '@/models'
import { GraduationCap, UsersRound } from 'lucide-vue-next'
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ classroom: Classroom }>()

const { classroom } = toRefs(props)
</script>

<template>
	<div
		class="bg-neutral-50 dark:bg-gray-800 border rounded-lg hover:shadow overflow-hidden transition-all duration-300 hover:bg-neutral-100"
	>
		<div class="p-6">
			<h2 class="truncate sm:text-2xl text-xl mb-4 text-gray-900 dark:text-gray-100 font-bold">
				{{ classroom.name }}
			</h2>
			<p class="truncate text-gray-600 dark:text-gray-300 mb-2 flex items-center font-medium">
				<GraduationCap class="size-5 mr-2" /> {{ classroom.teacher }}
			</p>
			<p class="truncate text-gray-600 dark:text-gray-300 mb-4 flex items-center font-medium">
				<UsersRound class="size-5 mr-2" /> {{ classroom.studentsCount }} ta o'quvchi
			</p>
			<Button @click="router.push(`/classrooms/${classroom.oneId}`)"> Learn More </Button>
		</div>
	</div>
</template>
