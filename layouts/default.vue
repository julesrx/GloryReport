<template>
    <div class="py-0 lg:py-2 px-2 lg:px-0">
        <ProgressBar />
        <GlobalAlerts />

        <main class="mx-auto max-w-screen-lg">
            <slot />
        </main>

        <footer>
            <SocialIcons />
        </footer>
    </div>
</template>
