<script setup lang="ts">
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface IntroLink {
  href: string
  text: string
  alt?: string
}

interface IntroItem {
  title: string
  content: string
  align: 'left' | 'right' | 'center'
  link?: IntroLink
}

defineProps<{
  items?: IntroItem[]
}>()
</script>

<template>
  <VPHomeBox class="home-intro">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="home-intro-item"
      :class="`home-intro-item--${item.align}`"
    >
      <h2 class="home-intro-title">{{ item.title }}</h2>
      <p class="home-intro-text" v-html="item.content" />
      <p v-if="item.link" class="home-intro-link">
        <a
          :href="item.link.href"
          :title="item.link.alt"
          :aria-label="item.link.alt"
        >{{ item.link.text }}</a>
      </p>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.home-intro-item {
  margin: 0 0 10vh;
  display: flex;
  flex-direction: column;
}

.home-intro-item--left {
  align-items: flex-start;
  text-align: left;
}

.home-intro-item--right {
  align-items: flex-end;
  text-align: right;
}

.home-intro-item--center {
  align-items: center;
  text-align: center;
}

.home-intro-title {
  font-size: 36px;
  font-weight: 700;
  width: fit-content;
  max-width: 100%;
  margin: 0 0 16px;
  padding: 5px;
  overflow-wrap: break-word;
  background: var(--vp-bg-home-hero-name, linear-gradient(315deg, var(--vp-c-purple-1) 15%, var(--vp-c-brand-2) 65%, var(--vp-c-brand-2) 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.home-intro-text {
  font-size: 16px;
  color: var(--vp-c-text-1);
  margin: 0;
  padding: 0 15px;
  line-height: 1.7;
}

.home-intro-link {
  margin: 0;
  padding: 0 15px;
}

.home-intro-link a {
  font-size: 16px;
  color: var(--vp-c-brand);
  font-weight: 500;
  text-decoration: none;
}

@media (max-width: 480px) {
  .home-intro-title {
    font-size: 26px;
  }

  .home-intro-text {
    font-size: 15px;
    padding: 0 5px;
  }
}
</style>
