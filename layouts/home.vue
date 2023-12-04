<template>
    <main class="px-2 lg:px-0">
        <GlobalAlerts />

        <slot />

        <Teleport to="body">
            <footer class="fixed bottom-0 right-0">
                <SocialIcons />
            </footer>
        </Teleport>
    </main>
</template>
