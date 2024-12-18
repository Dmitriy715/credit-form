<script setup>
import StepOne from "~/components/take-credit/StepOne.vue";
import StepTwo from "~/components/take-credit/StepTwo.vue";
import StepThree from "~/components/take-credit/StepThree.vue";
import { reactive } from "vue";
import { constants } from '@/static/take-credit/constants.js';
import { useToast } from 'vue-toastification';
import { Steppy } from 'vue3-steppy'

const toast = useToast();

let { userPersonalInformation, addressInformation, financialInformation } = constants;

useHead({
  title: 'Кредитная форма',
  meta: [
    { name: 'description', content: 'Получение кредита' },
  ],
});

// Проверка и заполнение данных, если они есть в localStorage.
const user = reactive({
  userPersonalInformation: window?.localStorage.getItem('userPersonalInformation') ?
    JSON.parse(window.localStorage.getItem('userPersonalInformation')) :
    structuredClone(userPersonalInformation),
  addressInformation: window?.localStorage.getItem('addressInformation') ?
    JSON.parse(window.localStorage.getItem('addressInformation')) :
    structuredClone(addressInformation),
  financialInformation: structuredClone(financialInformation),
});

let currentStep = reactive({
  val: !process.client ? 0 :
    window?.localStorage.getItem('currentStep') ?
    Number(window.localStorage.getItem('currentStep')) : 1,
  forward: function () {
    this.val++;
  },
  back: function () {
    this.val--;
  }
});

// Функция, вызываемая из дочерних компонентов, чтобы не мутировать объект напрямую
function changeUserValue(obj, propertyName, value) {
  user[obj][propertyName] = value;
}

function nextStep(obj) {
  currentStep.forward()
  // Сохранение данных незаполненной формы
  if (process.client) {
    // ТЗ: "При перезагрузке страницы данные должны быть восстановлены, и пользователь должен продолжить с того шага, на котором остановился."
    // Сейчас запись данных выполняется только при полном прохождении шага.
    // Если небходимо записывать данные при каждом изменении поля, можно это реализовать в changeUserValue()
    localStorage.setItem(obj, JSON.stringify(user[obj]));
    localStorage.setItem('currentStep', currentStep.val);
  }
}

async function sendForm() {
  await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(user),
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error(`Ошибка при отправке данных. Статус: ${res.status}`)
    }

    toast.success(`Заявка успешно сохранена!`, { timeout: 3000 });
    // После успешной отправки данных можно очистить localStorage, т.к. данные клиента уже записаны в базу
    // localStorage.clear();
  }).catch(error => {
    toast.error(error.message, {
      timeout: 3000,
    });
  });
}

const steps = [
  { title: 'Персональная информация', isValid: true, isSuccess: false },
  { title: 'Адресная информация', isValid: false, isSuccess: false },
  { title: 'Финансовая информация', isValid: false, isSuccess: false },
];

function blockNonNumbers(event) {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Home',
    'End',
  ];

  if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}
</script>

<template>
  <div class="credit-root">
<!--    Индикатор шагов-->
    <Steppy
        v-if="currentStep.val !== 0"
        :step="currentStep.val"
        :tabs="steps"
        primaryColor1="#652d86"
    >
    </Steppy>
    <step-one
      v-if="currentStep.val === 1"
      @step-forward="nextStep"
      @change-value="changeUserValue"
      :user="user.userPersonalInformation"
      :blockNonNumbers="blockNonNumbers"
    ></step-one>
    <step-two
      v-else-if="currentStep.val === 2"
      @step-back="currentStep.back()"
      @step-forward="nextStep"
      @change-value="changeUserValue"
      :user="user.addressInformation"
      :selected-country="user.addressInformation.country"
      :blockNonNumbers="blockNonNumbers"
    ></step-two>
    <step-three
      v-else-if="currentStep.val === 3"
      @step-back="currentStep.back()"
      @send-form="sendForm"
      @change-value="changeUserValue"
      :user="user.financialInformation"
      :blockNonNumbers="blockNonNumbers"
    ></step-three>
  </div>
</template>

<style lang="scss" scoped>
.credit-root {
  margin: 0 30%;
}
</style>