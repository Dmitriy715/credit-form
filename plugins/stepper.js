import {Steppy} from 'vue3-steppy'
// import 'vue3-steppy/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Steppy);
});