import './styles.css';
import countriesCard from './templates/countries-card.hbs';
import countriesItem from './templates/countries-item.hbs';

import fetchCountries from './fetchCountries.js';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import debounce from 'lodash.debounce';


const refs = {
    cardContainer: document.querySelector(".js-card-container"),
    searchForm: document.querySelector("#js-form-search"),
    searchInput: document.querySelector(".search-input"),
}


refs.searchForm.addEventListener('submit', event => {
  event.preventDefault();
});

refs.searchForm.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 500),
);

function searchFormInputHandler(e) {
    const searchQuery = e.target.value;


    clearListItems();

   fetchCountries(searchQuery).then(data => {
    const markup = buildListItemMarkup(data);
    const renderCountriesList = buildCountriesList(data);
    if (!data) {
      return;
    } else if (data.length > 10) {
      PNotify.defaults.styling = 'material';
      PNotify.error({
        title: 'Oh No!',
        text: 'Too many matches found.Please enter a more specific query',
      });
    } else if (data.length >= 2 && data.length <= 10) {
      insertListItem(renderCountriesList);
    } else if (data.length === 1) {
      insertListItem(markup);
    } else {
      alert('Ничего не найдено.Корректно введите запрос');
    }
  });
}

function insertListItem(items) {
  refs.cardContainer.insertAdjacentHTML('beforeend', items);
}
function buildCountriesList(items) {
  return countriesItem(items);
}

function buildListItemMarkup(items) {
  return countriesCard(items);
}

function clearListItems() {
  refs.cardContainer.innerHTML = '';
}

