<script setup>
import { useToast } from 'vue-toastification';

const toast = useToast();

let emit = defineEmits(['step-back', 'step-forward', 'change-value']);

let props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  selectedCountry: {
    type: Object,
    required: true,
  },
  blockNonNumbers: {
    type: Function,
    required: true,
  },
});


function selectCountry(code) {
  return props?.selectedCountry?.cca3 ? code === props.selectedCountry.cca3 : code === 'KAZ';
}

let countries = ref([]);

async function countriesArr() {
  await fetch('https://restcountries.com/v3.1/all', {
    method: 'GET',
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Ошибка при получении списка стран. Статус: ${res.status}`)
    }

    countries.value = await response.json();

    // Если страны нет в объекте user, по дефолту стоит Казахстан
    if (!props.user.country.cca3) {
      changeValue('country', 'KAZ');
    }
  }).catch((error) => {
    toast.error(error.message, {
      timeout: 3000,
    });
  });
}
onMounted(() => {
  countriesArr();
})

function nextStep() {
  if (validateForm()) {
    emit('step-forward', 'addressInformation');
  } else {
    toast.error(`Произошла ошибка. Пожалуйста, проверьте введенные данные.`, {
      timeout: 3000,
    });
  }
}

function changeValue(propertyName, event) {
  if (propertyName === 'country') {
    emit('change-value', 'addressInformation', propertyName, countries.value.find((item) => item.cca3 === event));
  } else {
    emit('change-value', 'addressInformation', propertyName, event);
  }

  // Очистка ошибки при вводе новых данных
  if (errors[propertyName]) {
    errors[propertyName] = '';
  }
}

function validateForm() {
  clearErrors();

  if (!props.user.country.cca3) {
    errors.country = 'Страна обязательна для заполнения';
  }

  if (!props.user.city.trim()) {
    errors.city = 'Город обязателен для заполнения';
  }

  if (!props.user.street.trim()) {
    errors.street = 'Улица обязательна для заполнения';
  }

  if (!props.user.postalCode.trim()) {
    errors.postalCode = 'Почтовый индекс обязателен для заполнения';
  } else if (props.user.postalCode.trim().length < 5) {
    errors.postalCode = 'Почтовый индекс должен содержать не менее 5 символов'
  }

  return !Object.values(errors).some((error) => error);
}

function clearErrors() {
  for (let key in errors) {
    errors[key] = '';
  }
}
let errors = reactive({
  country: '',
  city: '',
  street: '',
  postalCode: '',
});
</script>

<template>
<div>
  <div class="form-group">
    <div class="form-field" :class="{ '-error': errors.country }">
      <label class="form-field__label">Страна</label>
      <select
        ref="country"
        class="form-field__select"
        name="country"
        id="country"
        @change="(event) => changeValue('country', event.target.value)"
      >
        <option
          v-for="country of countries"
          :key="country.cca3"
          :value="country.cca3"
          :selected="selectCountry(country.cca3)"
        >
          {{ country.name.common }}
        </option>
      </select>
      <small class="form-field__small">{{ errors.country }}</small>
    </div>
    <div class="form-field" :class="{ '-error': errors.city }">
      <label class="form-field__label">Город</label>
      <input
          class="form-field__input"
          type="text"
          :value="props.user.city"
          @input="(event) => changeValue('city', event.target.value)"
      >
      <small class="form-field__small">{{ errors.city }}</small>
    </div>
    <div class="form-field" :class="{ '-error': errors.street }">
      <label class="form-field__label">Улица</label>
      <input
          class="form-field__input"
          type="text"
          :value="props.user.street"
          @input="(event) => changeValue('street', event.target.value)"
      >
      <small class="form-field__small">{{ errors.street }}</small>
    </div>
    <div class="form-field" :class="{ '-error': errors.postalCode }">
      <label class="form-field__label">Почтовый индекс</label>
      <input
          class="form-field__input"
          type="text"
          maxlength="10"
          :value="props.user.postalCode"
          @input="(event) => changeValue('postalCode', event.target.value)"
          @keydown="props.blockNonNumbers"
      >
      <small class="form-field__small">{{ errors.postalCode }}</small>
    </div>
  </div>
  <div class="btn-group">
    <button class="btn btn-secondary" @click="$emit('step-back')">Назад</button>
    <button class="btn btn-primary" @click="nextStep()">Далее</button>
  </div>
</div>
</template>

<style scoped>

</style>