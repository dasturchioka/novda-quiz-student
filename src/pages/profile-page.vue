<script lang="ts" setup>
import { useLoading } from '@/globals/loading'
import Loading from '@/components/app/loading.vue'
import { storeToRefs } from 'pinia'
import { useProfile } from '@/modules/profile/store'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import { onMounted } from 'vue'
import BackButton from '@/components/app/back-button.vue'

const profileStore = useProfile()
const loadingStore = useLoading()

const { profile } = storeToRefs(profileStore)
const { loading } = storeToRefs(loadingStore)

onMounted(async () => {
	await profileStore.getProfile()
})
</script>

<template>
	<Loading v-if="loading" />
	<div v-else-if="!loading && profile" class="profile-page">
		<div class="w-full">
			<BackButton/>
			<header class="bg-blue-500 text-white p-6 rounded-lg shadow-md mb-6">
				<h1 class="text-3xl font-bold font-noto">Profil</h1>
			</header>

			<Card class="w-full">
				<CardHeader>
					<CardTitle>{{ profile.fullname }}</CardTitle>
					<CardDescription>{{ profile.oneId }}</CardDescription>
				</CardHeader>
			</Card>
		</div>
	</div>
	<div v-else-if="!loading && !profile">Ma'lumot topilmadi</div>
</template>
