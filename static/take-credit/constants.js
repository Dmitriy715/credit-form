export const constants = {
  userPersonalInformation: Object.freeze({
    name: '',
    surname: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
  }),
  addressInformation: Object.freeze({
    country: {},
    city: '',
    street: '',
    postalCode: '',
  }),
  financialInformation: Object.freeze({
    profitPerMonth: '',
    creditSum: 20000,
    creditTerm: {},
  })
}
// Объекты можно использовать для очистки формы/в качестве значения, если нет данных в localStorage
