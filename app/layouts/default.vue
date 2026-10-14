<template>
  <div class="flex min-h-screen flex-col overflow-x-clip">
    <AppNavbar />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
