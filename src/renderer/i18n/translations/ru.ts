import TranslationInterface from 'renderer/i18n/translations/TranslationInterface';

const locale: TranslationInterface = {
  languageName: 'Русский',
  devices: {
    title: 'Устройства',
    discoverButton: 'Найти устройства',
    discoveringSlogan: 'Ищем повсюду...',
  },
  settings: {
    title: 'Опции',
    theme: {
      heading: 'Использовать светлую тему',
      description: 'может бить по глазам ночью...',
    },
    startup: {
      heading: 'Запускать с системой',
      description: 'сэкономь пару кликов',
    }
  },
  colorChanger: {
    title: 'Выбор цвета {device}',
    presets: 'Предустановки:',
    whiteLevel: 'Уровень белого:',
  },
  keybindChanger: {
    title: 'Изменение клавиш для {device}',
    record: {
      default: 'Записать клавиши',
      stop: 'Остановить запись',
      save: 'Сохранить',
      cancel: 'Отмена',
      inputPlaceholder: 'Задай название...',
    },
    select: {
      default: 'Использовать существующие',
      save: 'Сохранить',
      create: 'Создать новые',
    },
    current: 'Текущее сочетание клавиш',
  },
};

export default locale;
