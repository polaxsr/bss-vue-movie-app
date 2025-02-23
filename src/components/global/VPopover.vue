<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue'
import { useElementBounding } from '@vueuse/core'

const props = defineProps<{
  zIndex?: number | string
  hover?: boolean
  right?: boolean
  fluid?: boolean
}>()

const isVisible = ref<boolean>(false)
const activator = ref<HTMLElement | null>(null);
const popover = ref(null)

const activatorBounding = useElementBounding(activator)
const popoverBounding = useElementBounding(popover)

const popoverStyle = computed<string>(() => {
  if (!activator.value) return ''

  return [
    'position: absolute',
    `top: ${activatorBounding.bottom.value}px`,
    `left: ${props.right ? activatorBounding.right.value - popoverBounding.width.value : activatorBounding.left.value}px`,
    props.fluid ? `width: ${activatorBounding.width.value}px` : null,
    props.zIndex ? `z-index: ${props.zIndex}` : null,
  ]
    .filter(Boolean)
    .join(';')
})

const show = (): void => {
  isVisible.value = true
}

const hide = (): void => {
  isVisible.value = false
}

const mouseenter = (event: MouseEvent): void => {
  if (!props.hover || !event?.target) return

  if (!activator.value) {
    activator.value = event.target as HTMLElement;
  }

  show()
}

const mouseleave = (): void => {
  if (!props.hover) return

  hide()
}

const click = (event: PointerEvent): void => {
  if (props.hover || !event?.target) return

  if (!activator.value) {
    activator.value = event.target as HTMLElement;
  }

  show()
}

const activatorProps = ref({
  on: {
    mouseenter,
    mouseleave,
    click,
    show,
    hide,
  },
})
</script>

<template>
  <slot name="activator" v-bind="activatorProps" />

  <Teleport to="body">
    <Transition name="popover">
      <div
        v-show="isVisible"
        class="pt-2"
        ref="popover"
        :style="popoverStyle"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
        @click="hide"
      >
        <div class="bg-white border border-gray-200 p-2 rounded-md">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.popover {
  &-content {
    margin-block-start: var(--p-popover-content-gutter);
    background: var(--p-popover-content-background);
    color: var(--p-popover-content-color);
    border: 1px solid var(--p-popover-content-border-color);
    border-radius: var(--p-popover-content-border-radius);
    box-shadow: var(--p-popover-content-shadow);
  }

  &:before,
  &:after {
    content: none;
  }

  .p-menu {
    border: none;
    margin: -1rem;
    padding: 0.375rem;

    &-separator {
      margin: 0.25rem -0.375rem;
    }
  }

  &-enter-active,
  &-leave-active {
    transition:
      transform 0.1s ease-in-out,
      opacity 0.1s ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    transform: translateY(-3px);
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
