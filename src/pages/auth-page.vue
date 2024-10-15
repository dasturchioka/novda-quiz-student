<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, KeyRound } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useAuth } from '@/modules/auth/store'
import { useOneId } from '@/composables/useOneId'
import Logo from "@/assets/logo.svg"

const { generateRandomOneId } = useOneId()
const authStore = useAuth()

const showPassword = ref(false)

const togglePassword = () => {
	showPassword.value = !showPassword.value
}

const studentDetails = ref<{
	firstname: string
	lastname: string
	oneId: string
	password: string
	classroomOneId: string
}>({
	firstname: '',
	lastname: '',
	oneId: '',
	password: '',
	classroomOneId: '',
})

const fullname = computed(() => {
	return `${studentDetails.value.lastname} ${studentDetails.value.firstname}`
})

const generateOneId = async () => {
	const { value } = await generateRandomOneId()

	studentDetails.value.oneId = value
}
</script>

<template>
	<div class="register-page h-screen flex flex-col justify-center items-center">
		<div class="w-full flex flex-col items-center max-w-md mx-auto p-6">
			<img :src="Logo" class="size-10 sm:mb-6 mb-4">
			<Tabs defaultValue="register" class="w-full">
				<TabsList class="grid w-full grid-cols-2">
					<TabsTrigger value="register">Ro'yxatdan o'tish</TabsTrigger>
					<TabsTrigger value="login">Login</TabsTrigger>
				</TabsList>
				<TabsContent value="register">
					<form
						@submit.prevent="
							authStore.register({
								fullname,
								password: studentDetails.password,
								classroomOneId: studentDetails.classroomOneId,
								oneId: studentDetails.oneId
							})
						"
						class="space-y-4"
					>
						<div class="space-y-2">
							<Label for="register-fullname">
								Ism familiya <i class="font-light">faqat lotin harflarida</i>
								<b class="text-red-500">*</b>
							</Label>
							<div class="mini-groups flex items-center space-x-2">
								<Input
									autocomplete="username"
									autocapitalize
									v-model:modelValue.trim="studentDetails.firstname"
									id="register-firstname"
									placeholder="Ism"
									required
								/>
								<Input
									autocomplete="username"
									autocapitalize
									v-model:modelValue.trim="studentDetails.lastname"
									id="register-lastname"
									placeholder="Familiya"
									required
								/>
							</div>
						</div>
							<div class="space-y-2">
							<Label for="register-oneId">OneId (login) <b class="text-red-500">*</b></Label>
							<div class="relative">
								<Input
									v-model:modelValue="studentDetails.oneId"
									id="register-oneId"
									readonly
									type="text"
									placeholder="Kalitni bosing"
									required
								/>
								<Button
									variant="ghost"
									type="button"
									class="absolute right-3 top-1/2 -translate-y-1/2"
									@click="generateOneId"
								>
									<KeyRound class="size-5"/>
								</Button>
							</div>
						</div>
						<div class="space-y-2">
							<Label for="register-password">Parol <b class="text-red-500">*</b></Label>
							<div class="relative">
								<Input
									autocomplete="current-password"
									v-model:modelValue.trim="studentDetails.password"
									id="register-password"
									:type="[showPassword ? 'text' : 'password']"
									placeholder="Kamida 8 ta belgi"
									required
								/>
								<Button
									variant="ghost"
									type="button"
									class="absolute right-3 top-1/2 -translate-y-1/2"
									@click="togglePassword"
								>
									<EyeOffIcon v-if="showPassword" class="h-4 w-4 text-gray-500" />
									<EyeIcon v-else class="h-4 w-4 text-gray-500" />
								</Button>
							</div>
						</div>
						<div class="space-y-2">
							<Label for="register-classroomOneId">Sinfxona oneId </Label>
							<Input
								v-model:modelValue.trim="studentDetails.classroomOneId"
								id="register-classroomOneId"
								placeholder="O'qituvchingizdan sinfxona oneIdsini so'rang"
							/>
						</div>
						<Button type="submit" class="w-full">Ro'yxatdan o'tish</Button>
					</form>
				</TabsContent>
				<TabsContent value="login">
					<form
						@submit.prevent="
							authStore.login({ oneId: studentDetails.oneId, password: studentDetails.password })
						"
						class="space-y-4"
					>
						<div class="space-y-2">
							<Label for="login-oneid">OneId <b class="text-red-500">*</b></Label>
							<Input
								v-model:modelValue="studentDetails.oneId"
								id="login-oneid"
								placeholder="Tizim sizga bergan oneId"
								required
							/>
						</div>
						<div class="space-y-2">
							<Label for="login-password">Parol <b class="text-red-500">*</b></Label>
							<div class="relative">
								<Input
									autocomplete="current-password"
									id="login-password"
									v-model:modelValue="studentDetails.password"
									:type="[showPassword ? 'text' : 'password']"
									placeholder="Parolingizni eslang"
									required
								/>
								<Button
									variant="ghost"
									type="button"
									class="absolute right-3 top-1/2 -translate-y-1/2"
									@click="togglePassword"
								>
									<EyeOffIcon v-if="showPassword" class="h-4 w-4 text-gray-500" />
									<EyeIcon v-else class="h-4 w-4 text-gray-500" />
								</Button>
							</div>
						</div>
						<Button type="submit" class="w-full">Login</Button>
					</form>
				</TabsContent>
			</Tabs>
		</div>
		<footer>
			<a href="https://dasturchioka.uz" target="_blank" class="font-semibold"
				><b class="text-blue-400">@</b> dasturchioka</a
			>
		</footer>
	</div>
</template>
