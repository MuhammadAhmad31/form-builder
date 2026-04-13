<script setup lang="ts">
import { Button } from '@/components/ui/button';

</script>

<template>
  <main class="min-h-screen bg-background px-6 py-16 text-foreground">
    <div class="mx-auto flex max-w-5xl flex-col gap-8">
      <div class="space-y-4">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Vue Pages Structure
        </p>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
          Home Page
        </h1>
        <Button variant="outline" size="sm" class="mt-4">
          Tombol Contoh
        </Button>
        <p class="max-w-2xl text-base leading-7 text-muted-foreground">
          Struktur `pages` sekarang sudah aktif lewat `vue-router`. Gunakan folder ini untuk komponen level halaman.
        </p>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Available Pages</h2>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            to="/builder"
          >
            Form Builder
          </RouterLink>
          <RouterLink
            class="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 transition"
            to="/renderer"
          >
            Form Renderer
          </RouterLink>
          <RouterLink
            class="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 transition"
            to="/codeparl"
          >
            Codeparl Form Builder
          </RouterLink>
          <RouterLink
            class="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 transition"
            to="/codeparl/render"
          >
            Codeparl Renderer
          </RouterLink>
        </div>
        <p class="text-sm text-muted-foreground max-w-2xl">
          <strong>Form Builder:</strong> Create forms visually with drag-and-drop interface. Export schema and submit to backend.
          <br />
          <strong>Form Renderer:</strong> Render forms from schema JSON and collect user submissions.
        </p>
      </div>
    </div>
  </main>
</template>
