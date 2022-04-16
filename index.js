class Button extends Block {
  constructor(props) {
		// Создаём враппер дом-элемент button
    super("button", props);
  }

  render() {
		// В проекте должен быть ваш собственный шаблонизатор
    return `<div>${this.props.text}</div>`;
  }
}

function render(query, block) {
  const root = document.querySelector(query);
  root.appendChild(block.getContent());
  return root;
}

const button = new Button({
		text: 'Click me',
});

// app — это class дива в корне DOM
render(".app", button);

// Через секунду контент изменится сам, достаточно обновить пропсы
setTimeout(() => {
  console.log('timeout for Click me, please')
  button.setProps({
    text: 'Click me, please',
  });
}, 1000);

setTimeout(() => {
  console.log('timeout for hide')
  button.hide();
}, 2000);

setTimeout(() => {
  console.log('timeout for show')
  button.show();
}, 3000);