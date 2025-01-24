<style scoped>
.custom-element {
  position: absolute;
  white-space: pre-wrap;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* 确保图片元素也不可选中 */
.custom-element img {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
}
</style> 