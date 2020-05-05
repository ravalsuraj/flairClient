<template>
  <v-sheet
    class="py-2 px-4 agc-message-bubble"
    :dark="!message.self"
    :color="getMessageColor(message.self)"
    :class="{ 'left-aligned': !message.self, 'right-aligned': message.self }"
  >{{ message.content.text }}</v-sheet>
</template>

<script>
export default {
  name: "TextResponse",
  props: {
    message: {
      text: String,
      self: Boolean
    }
  },
  methods: {
    getMessageAlignment(isSelf) {
      if (isSelf === true) {
        return "end";
      } else {
        return "start";
      }
    },
    getMessageColor(isSelf) {
      if (isSelf === false) {
        return "special-color";
      } else {
        return "#d3d3d3";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.agc-message-container {
  list-style: none;
  width: 100%;
  clear: both;
}

.agc-message-bubble {
  border: 1px solid black;
  max-width: 70%;
  margin-bottom: 10px;
}
.agc-user-img-container {
  display: inline-block;
  height: 15px;
  width: 15px;
  background-color: red;

  border-radius: 50%;
}

.left-aligned {
  float: left;
}
.right-aligned {
  float: right;
}
</style>
