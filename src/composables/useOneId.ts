import { computed } from 'vue'

export const useOneId = () => {
	const PREFIX = 'ST'

	const generateRandomOneId = async () => {
		return computed(() => {
			return PREFIX + Math.floor(Math.random() * 9999999)
		})
	}

	return { generateRandomOneId }
}
