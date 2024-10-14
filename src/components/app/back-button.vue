<script lang="ts" setup>
import { ArrowLeft } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
</script>

<template>
	<template v-if="!$slots.default">
		<Button @click="$router.go(-1)" class="w-auto self-start px-2 mb-2" variant="ghost">
			<ArrowLeft class="size-5 mr-2" /> Orqaga
		</Button>
	</template>
	<template v-else>
		<slot></slot>
	</template>
</template>
