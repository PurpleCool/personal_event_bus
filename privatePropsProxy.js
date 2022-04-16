function isPrivate(property) {
  return !!(property.startsWith('_'))
}

const getPrivatePropsProxy = (props) => new Proxy(props, {
   deleteProperty: function(target, property) {
    if (property in target){
      if (isPrivate(property)) {
        throw new Error('Нет прав');
        return false;
      } else {
        delete target[property]
        return true;
      }
    }
    else {
      return false
    }
  },
  get: function(target, property, receiver) {
    if (isPrivate(property)) {
      throw new Error('Нельзя получить просто так');
    } else {
      let value = target[property];
      return (typeof value === 'function') ? value.bind(target) : value;    
    }
  },
  set: function(target, property, value, receiver) {
    if (isPrivate(property)) {
      throw new Error('Нет прав');
      return false;
    } else {
      target[property] = value;
      return true;
    }
  }
});


let handlers = 'handlers';

function makeObservable(target) {
  // 1. Создадим хранилище обработчиков
  target[handlers] = [];

  // положим туда функции-обработчики для вызовов в будущем
  target.observe = function(handler) {
    this[handlers].push(handler);
  };

  // 2. Создадим прокси для реакции на изменения
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let prevValue = Reflect.set(target, property, receiver);
      if (areEqual(prevValue, value)) {
        return true;
      }

      let success = Reflect.set(...arguments); // перенаправим операцию к оригинальному объекту
      if (success) { // если не произошло ошибки при записи свойства
        // вызовем обработчики
        target[handlers].forEach(handler => handler(property, value));
      }
      return success;
    }
  });
}