<template>
    <div class="py-2 lg:pb-2 lg:pt-4 px-2 lg:px-0">
        <ProgressBar />
        <GlobalAlerts />

        <main class="mx-auto max-w-screen-lg">
            <slot />
        </main>

        <footer class="lg:fixed lg:bottom-0 lg:right-0">
            <SocialIcons />
        </footer>
    </div>
</template>
