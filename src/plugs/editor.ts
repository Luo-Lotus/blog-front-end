import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';

import Prism from 'prismjs';
import hljs from 'highlight.js';

VMdPreview.use(vuepressTheme, {
  Prism,
});

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
export default {VueMarkdownEditor,VMdPreview}