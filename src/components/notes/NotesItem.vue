<template>
  <li class="item-wrapper">
    <div class="text-wrapper">
      <div class="title-wrapper flex flex-jc-sb">
        <h4 class="item-title">{{ title }}</h4>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "contents"],
};
</script>