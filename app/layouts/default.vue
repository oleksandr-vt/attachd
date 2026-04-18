<template>
  <div class="flex flex-col min-h-screen">
    <AppNavbar />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
