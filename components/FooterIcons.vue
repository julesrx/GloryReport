<template>
    <Teleport to="body">
        <div class="fixed bottom-0 right-0 p-2 opacity-25 flex justify-end items-center space-x-1">
            <NuxtLink
                to="https://github.com/julesrx/glory.report"
                target="_blank"
                title="source code"
            >
                <Icon name="bi:github" size="20" />
            </NuxtLink>

            <NuxtLink to="https://ko-fi.com/julesrx" target="_blank" title="tip :)">
                <Icon name="simple-icons:kofi" size="20" />
            </NuxtLink>
        </div>
    </Teleport>
</template>
