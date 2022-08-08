<template>
  <li class="item-wrapper flex">
    <div class="indicator">
      <span class="active"></span>
    </div>

    <div class="text-wrapper">
      <div class="title-wrapper flex flex-jc-sb">
        <h4 class="item-title">{{ title }}</h4>
      </div>
      <div class="item-text">
        <p class="text-contents">{{ setTextLength(content, 200) }}</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "content"],
  inject: ["setTextLength"],
};
</script>