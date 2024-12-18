<script setup>
import { useToast } from 'vue-toastification';

const toast = useToast();
let emit = defineEmits(['set-step', 'step-forward', 'change-value']);

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

function nextStep() {
  if (validateForm()) {
    emit('step-forward', 'userPersonalInformation');
  } else {
    // toast лучше использовать для показа результата запросов, но если пользователь зашел с телефона, а форма большая, он может не понять, что в форме есть ошибка
    toast.error(`Произошла ошибка. Пожалуйста, проверьте введенные данные.`, {
      timeout: 3000,
    });
  }
}

function changeValue(propertyName, event) {
  if (propertyName === 'phoneNumber') {
    // Для удобства обязательная маска имеет вид +7
    let correctedNumber = '+7' + event.replace(/\D/g, '').replace(/^7/, '');
    emit('change-value', 'userPersonalInformation', propertyName, correctedNumber);
  } else {
    emit('change-value', 'userPersonalInformation', propertyName, event);
  }

  // Очистка ошибки при вводе новых данных
  if (errors[propertyName]) {
    errors[propertyName] = '';
  }
}

// Валидация
let errors = reactive({
  name: '',
  surname: '',
  birthDate: '',
  phoneNumber: '',
  email: '',
});

function validateForm() {
  clearErrors();

  if (!props.user.name.trim()) {
    errors.name = 'Имя обязательно для заполнения';
  }

  if (!props.user.surname.trim()) {
    errors.surname = 'Фамилия обязательна для заполнения';
  }

  if (!props.user.birthDate) {
    errors.birthDate = 'Дата рождения обязательна для заполнения';
  }

  if (props.user.phoneNumber.trim().length !== 12) {
    errors.phoneNumber = 'Номер телефона обязателен для заполнения';
  }

  if (!props.user.email.trim()) {
    errors.email = 'Email обязателен для заполнения';
  } else if (!isValidEmail(props.user.email)) {
    errors.email = 'Введите корректный Email';
  }

  return !Object.values(errors).some((error) => error);
}

function clearErrors() {
  for (let key in errors) {
    errors[key] = '';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
</script>

<template>
  <div>
    <div class="form-group">
      <div class="form-field" :class="{ '-error': errors.name }">
        <label class="form-field__label">Имя</label>
        <input
          class="form-field__input"
          type="text"
          :value="props.user.name"
          @input="(event) => changeValue('name', event.target.value)"
        >
        <small class="form-field__small">{{ errors.name }}</small>
      </div>
      <div class="form-field" :class="{ '-error': errors.surname }">
        <label class="form-field__label">Фамилия</label>
        <input
          class="form-field__input"
          type="text"
          :value="props.user.surname"
          @input="(event) => changeValue('surname', event.target.value)"
        >
        <small class="form-field__small">{{ errors.surname }}</small>
      </div>
      <div class="form-field" :class="{ '-error': errors.birthDate }">
        <label class="form-field__label">Дата рождения</label>
        <input
          class="form-field__input"
          type="date"
          :value="props.user.birthDate"
          @input="(event) => changeValue('birthDate', event.target.value)"
        >
        <small class="form-field__small">{{ errors.birthDate }}</small>
      </div>
      <div class="form-field" :class="{ '-error': errors.phoneNumber }">
        <label class="form-field__label">Номер телефона</label>
        <input
          class="form-field__input"
          type="text"
          placeholder="+77XXXXXXXXX"
          maxlength="12"
          :value="props.user.phoneNumber"
          @input="(event) => changeValue('phoneNumber', event.target.value)"
          @keydown="props.blockNonNumbers"
        >
        <small class="form-field__small">{{ errors.phoneNumber }}</small>
      </div>
      <div class="form-field" :class="{ '-error': errors.email }">
        <label class="form-field__label">Email</label>
        <input
          class="form-field__input"
          type="text"
          :value="props.user.email"
          @input="(event) => changeValue('email', event.target.value)"
        >
        <small class="form-field__small">{{ errors.email }}</small>
      </div>
    </div>
    <div class="btn-group -end">
      <button class="btn btn-primary" @click="nextStep()">Далее</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>