// Procrastinator
const phrases = [
  {
    text: 'отправить другу смешную гифку',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/1.gif'
  },
  {
    text: 'посмотреть скидки на авиабилеты',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/2.png'
  },
  {
    text: 'разобраться, о чём поют рэперы',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/3.png'
  },
  {
    text: 'Юрий Дудь',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/4.png'
  },
  {
    text: 'расставить книги на полке по цвету',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/5.png'
  },
  {
    text: 'читать про зарплаты в Сан-Франциско',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/6.png'
  },
  {
    text: 'прочитать новости и ужаснуться в комментариях',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/7.png'
  },
  {
    text: 'попасть в поток грустных песен и вспомнить все ошибки молодости',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/8.png'
  },
  {
    text: 'посмотреть трейлер сериала и заодно первый сезон',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/9.png'
  },
  {
    text: 'поставить новый рекорд в 2048!',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/9.png'
  },
  {
    text: 'проверить непрочитанное в Telegram-каналах',
    image: 'https://code.s3.yandex.net/web-code/procrastinate/10.png'
  }
];

function getRandomElement(arr) {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

const button = document.querySelector('#button');
const videoButton = document.querySelector('#video-button');
const phrase = document.querySelector('.phrase');
const advice = document.querySelector('.procrastinator__text');
const image = document.querySelector('.procratinator__image');

button.addEventListener('click', () => {
  const randomElement = getRandomElement(phrases);
  // eslint-disable-next-line no-undef
  smoothly(phrase, 'textContent', randomElement.text);
  // eslint-disable-next-line no-undef
  smoothly(image, 'src', randomElement.image);

  if (randomElement.text === 'Юрий Дудь' || randomElement.text === 'поставить новый рекорд в 2048!') {
    videoButton.style.display = 'inline-flex';
  } else {
    videoButton.style.display = 'none';
  }

  if (randomElement.text.length > 40) {
    advice.style.fontSize = '33px';
  } else {
    advice.style.fontSize = '42px';
  }
});

for (let i = 0; i < 1; i += 1) {
  // eslint-disable-next-line no-undef
  smoothly(phrase, 'textContent', phrases[i].text);
  // eslint-disable-next-line no-undef
  smoothly(image, 'src', phrases[i].image);
}

videoButton.addEventListener('click', () => {
  const currentText = phrase.textContent;
  if (currentText === 'Юрий Дудь') {
    window.open('https://www.youtube.com/channel/UCMCgOm8GZkHp8zJ6l7_hIuA', '_blank');
  } else if (currentText === 'поставить новый рекорд в 2048!') {
    window.open('https://mail.ru/', '_blank');
  }
});

// Menu toggler
const menuButton = document.querySelector('.button-hamburger');
menuButton.addEventListener('click', () =>
  menuButton.classList.toggle('button-hamburger--active')
);

// Translator

// eslint-disable-next-line no-undef
const translator = new Translator({
  persist: false,
  languages: ['en', 'ru', 'be'],
  defaultLanguage: 'en',
  detectLanguage: true,
  filesLocation: '/content'
});

translator.load();

document.querySelector('.language-selector').addEventListener('click', evt => {
  if (evt.target.tagName === 'INPUT') {
    translator.load(evt.target.value);
  }
});
