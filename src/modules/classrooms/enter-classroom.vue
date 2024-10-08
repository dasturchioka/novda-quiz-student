<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { LogIn } from 'lucide-vue-next'
import { ref, toRefs } from 'vue'
import { useClassrooms } from './store'

const classroomsStore = useClassrooms()

const prop = defineProps<{ asWhat: 'card' | 'button' }>()

const { asWhat } = toRefs(prop)

const classroomOneId = ref('')
</script>

<template>
	<div class="enter-classroom">
		<Dialog>
			<DialogTrigger as-child>
				<Button class="mt-4" v-if="asWhat === 'button'"
					><LogIn class="size-5 mr-2" /> Sinfxonaga kirish</Button
				>
				<Button v-else-if="asWhat === 'card'" class="h-full px-4 w-full mt-4" variant="outline">
					<LogIn class="size-5 mr-2" /> Sinfxonaga kirish
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sinfxonaga kirish</DialogTitle>
					<DialogDescription>
						O'qituvchi sizga bergan sinfxona oneId orqali tizimga sinfxonaga kirishingiz
						mumkin</DialogDescription
					>
				</DialogHeader>
				<form
					@submit.prevent="classroomsStore.enterClassroom(classroomOneId)"
					class="space-y-4 w-full"
				>
					<div class="form-group space-y-1">
						<Label for="classroomOneId">Sinfxona OneId</Label>
						<Input
							placeholder="Boshida ikkita harf va raqamlardan iborat"
							v-model:model-value.trim="classroomOneId"
							id="classroomOneId"
						/>
					</div>
					<Button type="submit" class="w-full"><LogIn class="size-5 mr-2" /> Kirish</Button>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>
