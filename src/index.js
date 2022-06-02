import './css/styles.css';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import createCountryList from './templayts/countryList.hbs';
import createContryInfoEl from './templayts/countryEl.hbs';

const contryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const inputSearchBoxEl = document.querySelector('#search-box');
let lastInputText = '';
inputSearchBoxEl.addEventListener(
  'input',
  debounce(onInputPress, DEBOUNCE_DELAY)
);

function clearAllFields() {
  contryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}
function addComaToLanguages(obj) {
  const langStr = obj.languages.map(el => el.name).join(', ');
  return { ...obj, languages: langStr };
}

function onInputPress(event) {
  if (!event.target.value.trim()) {
    clearAllFields();
    return;
  } else if (lastInputText === event.target.value.trim()) {
    return;
  }
  fetchCountries(event.target.value.trim())
    .then(data => {
      clearAllFields();
      if (data.length >= 2 && data.length <= 10) {
        lastInputText = event.target.value.trim();
        return (contryListEl.innerHTML = createCountryList(data));
      } else if (data.length === 1) {
        lastInputText = event.target.value.trim();

        return (countryInfoEl.innerHTML = createContryInfoEl(
          addComaToLanguages(data[0])
        ));
      } else if (data.length >= 11) {
        lastInputText = event.target.value.trim();
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      if (error.message === '404') {
        clearAllFields();
        lastInputText = 'eror';
        return Notiflix.Notify.failure(
          'Oops, there is no country with that name'
        );
      }

      return Notiflix.Notify.failure(`Oops, server error:"${error}"`);
    });
}
