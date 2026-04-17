<script setup lang="ts">
import { FormRenderer } from '@/components/organism/form-finance'
import type { RendererSubmitPayload } from '@/components/organism/form-finance'

const handleRendererSubmit = (payload: RendererSubmitPayload) => {
	console.log('[FormRendererPage] payload to send BE:', payload)
}
</script>

<template>
	<FormRenderer :submit="handleRendererSubmit" />
</template>
