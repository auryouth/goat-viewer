<template>
  <q-page class="row items-stretch root">
    <div class="col relative-position">
      <slot></slot>
      <DxfViewer
        ref="viewer"
        :dxfUrl="dxfUrl"
        :fonts="fonts"
        @dxf-loaded="_OnLoaded"
        @dxf-cleared="_OnCleared"
        @dxf-message="_OnMessage"
      />
    </div>
  </q-page>
</template>

<script>
import DxfViewer from "@/components/DxfViewer";
import { DxfViewer as _DxfViewer } from "dxf-viewer";
import Vue from "vue";
import mainFont from "@/assets/fonts/Roboto-LightItalic.ttf";
import aux1Font from "@/assets/fonts/NotoSansDisplay-SemiCondensedLightItalic.ttf";
import aux2Font from "@/assets/fonts/HanaMinA.ttf";
import aux3Font from "@/assets/fonts/NanumGothic-Regular.ttf";

export default {
  name: "ViewerPage",
  components: { DxfViewer },

  props: {
    dxfUrl: {
      type: String,
    },
  },

  data() {
    return {
      layers: null,
    };
  },

  methods: {
    _OnLoaded() {
      const layers = this.$refs.viewer.GetViewer().GetLayers();
      layers.forEach((lyr) => Vue.set(lyr, "isVisible", true));
      this.layers = layers;
    },
    _OnCleared() {
      this.layers = null;
    },
    _OnMessage(e) {
      let type = "info";
      switch (e.detail.level) {
        case _DxfViewer.MessageLevel.WARN:
          type = "warning";
          break;
        case _DxfViewer.MessageLevel.ERROR:
          type = "negative";
          break;
      }
      this.$q.notify({ type, message: e.detail.message });
    },
  },

  created() {
    this.fonts = [mainFont, aux1Font, aux2Font, aux3Font];
  },
};
</script>

<style scoped lang="less">
.root {
  .layersCol {
    border-left: #dbdbdb solid 1px;
  }
}
</style>
