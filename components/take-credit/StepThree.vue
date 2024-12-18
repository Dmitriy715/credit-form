<script setup>
import {Steppy} from 'vue3-steppy'
import { useToast } from 'vue-toastification';

const toast = useToast();

let emit = defineEmits(['step-back', 'change-value']);

let props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  blockNonNumbers: {
    type: Function,
    required: true,
  },
});

let creditTermList = ref([
  {
    id: 1,
    value: 'На 3 месяца'
  },
  {
    id: 2,
    value: 'На 6 месяцев'
  },
  {
    id: 3,
    value: 'На 12 месяцев'
  }
]);

const creditSumStep = computed(() => (props.user.creditSum <= 100000 ? 1000 : 10000));

function handleForm() {
  if (validateForm()) {
    emit('send-form', 'financialInformation');
  } else {
    toast.error(`Произошла ошибка. Пожалуйста, проверьте введенные данные.`, {
      timeout: 3000,
    });
  }
}

function changeValue(propertyName, event) {
  if (propertyName === 'creditTerm') {
    emit('change-value', 'financialInformation', propertyName, creditTermList.value.find((item) => item.id === Number(event.target.value)));
  } else if (propertyName === 'creditSum') {
    let currentValue = event.target.value;
    if (currentValue > 100000 && currentValue % 10000 !== 0) {
      // Приводим значение к ближайшему кратному 10 000, если шаг изменился
      // Иначе на не кратных значениях будет работать некорректно
      emit('change-value', 'financialInformation', propertyName, Math.round(currentValue / 10000) * 10000);
    } else {
      emit('change-value', 'financialInformation', propertyName, currentValue);
    }
  } else {
    if (propertyName === 'creditSum') {
      console.warn('creditSum', event.target.value);
    }
    emit('change-value', 'financialInformation', propertyName, event.target.value);
  }

  // Очистка ошибки при вводе новых данных
  if (errors[propertyName]) {
    errors[propertyName] = '';
  }
}

function validateForm() {
  clearErrors();

  if (!props.user.profitPerMonth.trim() || props.user.profitPerMonth <= 0) {
    errors.profitPerMonth = 'Ежемесячный доход обязателен для заполнения';
  }

  if (!props.user.creditSum) {
    errors.creditSum = 'Сумма кредита обязательна для заполнения';
  }

  if (!props.user.creditTerm.id || Number(props.user.creditTerm.id) <= 0) {
    errors.creditTerm = 'Срок кредита обязателен для заполнения';
  }

  return !Object.values(errors).some((error) => error);
}

function clearErrors() {
  for (let key in errors) {
    errors[key] = '';
  }
}
let errors = reactive({
  profitPerMonth: '',
  creditSum: '',
  creditTerm: '',
});
</script>

<template>
  <div>
    <div class="form-group -row">
      <div class="form-field -row" :class="{ '-error': errors.profitPerMonth }">
        <label class="form-field__label">Ежемесячный доход</label>
        <input
            class="form-field__input"
            type="text"
            :value="props.user.profitPerMonth"
            @input="(event) => changeValue('profitPerMonth', event)"
            @keydown="props.blockNonNumbers"
        >
        <small class="form-field__small">{{ errors.profitPerMonth }}</small>
      </div>
      <div class="form-field -row" :class="{ '-error': errors.creditSum }">
        <label class="form-field__label">Сумма кредита</label>
        <input
          id="radius"
          type="range"
          min="20000"
          max="1000000"
          :step="creditSumStep"
          :value="props.user.creditSum"
          @input="(event) => changeValue('creditSum', event)"
        >
        <span>{{ props.user.creditSum }}</span>
        <small class="form-field__small">{{ errors.creditSum }}</small>
      </div>
      <div class="form-field -row" :class="{ '-error': errors.creditTerm }">
        <label class="form-field__label">Срок кредита</label>
        <select
          class="form-field__select"
          name="creditTerm"
          id="creditTerm"
          @change="(event) => changeValue('creditTerm', event)"
        >
          <option value="" v-show="false"></option>
          <option
            v-for="term of creditTermList"
            :key="term.id"
            :value="term.id"
          >
            {{ term.value }}
          </option>
        </select>
        <small class="form-field__small">{{ errors.creditTerm }}</small>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn btn-secondary" @click="$emit('step-back')">Назад</button>
      <button class="btn btn-primary" @click="handleForm">Отправить заявку</button>
    </div>
  </div>
</template>

<style scoped>

</style>