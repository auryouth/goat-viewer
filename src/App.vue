<template>
  <q-layout view="hHh lpr fff" data-nosnippet>
    <q-header>
      <q-toolbar>
        <q-toolbar-title :shrink="true">goat viewer</q-toolbar-title>
        <!-- </q-file> -->
        <q-btn
          icon="help"
          label="About"
          class="q-ml-lg"
          @click="aboutDialog = true"
        ></q-btn>
        <q-space />
        <q-btn
          icon="fab fa-github"
          color="primary"
          label="git load locally"
          no-caps
          class="q-mx-sm github"
          type="a"
          href="./components/gitadd.sh"
        />
        <q-btn
          icon="fab fa-github"
          color="primary"
          label="git load repo"
          no-caps
          class="q-mx-sm github"
          type="a"
          href="./components/gitpush.sh"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <ViewerPage :dxfUrl="dxfUrl">
        <div
          v-if="inputFile === null"
          class="centralUploader row justify-center items-center"
        >
          <div class="col-auto" style="width: 300px">
            <q-file
              filled
              bottom-slots
              clearable
              :value="inputFile"
              label="Select file or drag here"
              accept=".dxf"
              class="col"
              @input="_OnFileSelected"
              @clear="_OnFileCleared"
            >
              <template v-slot:before>
                <q-icon name="folder_open" size="xl" />
              </template>
              <template v-slot:hint>
                <span>File is processed locally in your browser</span>
              </template>
            </q-file>
          </div>
        </div>
      </ViewerPage>
    </q-page-container>

    <q-dialog v-model="aboutDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6">About</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section
          style="max-height: 50vh"
          class="scroll"
          v-html="aboutHtml"
        />
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script>
import ViewerPage from "@/components/ViewerPage";
export default {
  components: { ViewerPage },

  data() {
    return {
      dxfUrl: null,
      inputFile: null,
      isLocalFile: false,
      aboutDialog: false,
      urlDialog: false,
      inputUrl: null,
    };
  },

  methods: {
    _OnFileSelected(file) {
      if (!file) {
        this._OnFileCleared();
        return;
      }
      if (this.dxfUrl && this.isLocalFile) {
        URL.revokeObjectURL(this.dxfUrl);
      }
      this.isLocalFile = true;
      this.inputFile = file;
      this.dxfUrl = URL.createObjectURL(file);
    },

    _OnFileCleared() {
      if (this.inputFile) {
        this.inputFile = null;
        URL.revokeObjectURL(this.dxfUrl);
        this.dxfUrl = null;
        this.$q.notify({
          type: "info",
          message: "File cleared",
        });
      }
    },

    _OnUrl() {
      if (this.inputUrl === null) {
        return;
      }
      const url = this.inputUrl.trim();
      if (url === "") {
        return;
      }
      if (this.dxfUrl && this.isLocalFile) {
        URL.revokeObjectURL(this.dxfUrl);
      }
      this.isLocalFile = false;
      this.inputFile = new File(["remote_file"], url, { type: "text/plain" });
      this.dxfUrl =
        "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
    },
  },

  created() {
    const aboutBlock = document.getElementById("about");
    this.aboutHtml = aboutBlock.innerHTML;
    aboutBlock.style.display = "none";
    /* For web crawler. */
    document.getElementById("noscript").innerText = aboutBlock.innerText;
  },
  destroyed() {
    if (this.dxfUrl) {
      URL.revokeObjectURL(this.dxfUrl);
    }
  },
};
</script>

<style scoped lang="less">
a.github:hover {
  text-decoration: none;
}

.centralUploader {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
}
</style>
