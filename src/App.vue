<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { RouterView } from 'vue-router';
</script>

<template>
	<div class="app">
		<Toaster position="top-center" />
    <RouterView></RouterView>
	</div>
</template>

<style scoped></style>
