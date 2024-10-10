<script lang="ts" setup>
import Header from '@/components/ui/header/Header.vue'
import EnterClassroom from '@/modules/classrooms/enter-classroom.vue'
import SingleClassroom from '@/modules/classrooms/single-classroom.vue'
import { useClassrooms } from '@/modules/classrooms/store'
import { Boxes } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const classroomsStore = useClassrooms()

const { classrooms } = storeToRefs(classroomsStore)
</script>

<template>
	<div class="classrooms-page">
		<Header v-if="classrooms && classrooms.length">Sinfxonalar</Header>
		<div
			v-if="classrooms && classrooms.length"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
		>
			<SingleClassroom
				v-for="classroom in classrooms"
				:key="classroom.oneId"
				:classroom="classroom"
			/>
		</div>
		<div v-else class="h-screen w-full flex flex-col items-center justify-center">
			<Boxes class="size-40 text-neutral-300 stroke-[1px]" />
			<h3 class="font-bold sm:text-3xl text-xl mt-2 text-neutral-900">Sinfxonalar topilmadi</h3>
			<EnterClassroom as-what="button" />
		</div>
	</div>
</template>
