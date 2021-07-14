<template>
  <router-link
    :to="{
      name: 'Daily',
      params: {
        membershipType: 1,
        membershipId: '4611686018430712353'
      }
    }"
    >Daily report</router-link
  >

  <router-view></router-view>
</template>
