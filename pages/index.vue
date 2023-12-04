<template>
    <div class="h-screen flex flex-col justify-center items-center space-y-4">
        <NuxtLink to="/" class="flex flex-col items-center justify-center">
            <img src="~/assets/logo.png" class="h-52" />
            <h1 class="flex justify-center items-end">
                <div class="text-4xl font-bold">Glory</div>
                <div class="text-3xl">.report</div>
            </h1>
        </NuxtLink>

        <PlayerSearch />
    </div>
</template>
