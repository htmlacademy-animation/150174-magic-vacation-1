export default () => {
  class TextAnimationManager {
    constructor({
      element,
      timer = 500,
      classForActivate = `active`,
      property = `transform`,
      letterBlockLength = 3,
    }) {
      this._TIME_SPACE = 100;
      this._timeStep = 50;
      this._timer = timer;
      this._classForActivate = classForActivate;
      this._property = property;
      this._element = element;
      this._timeOffset = 0;
      this._initText = element && element.textContent;
      this._letterBlockLength = letterBlockLength;

      this.prePareText();
    }

    createElement(letter, index) {
      const span = document.createElement(`span`);
      span.textContent = letter;
      span.style.transition = `${this._property} ${this._timer}ms ease ${this._timeOffset}ms`;

      if ((index + 1) % this._letterBlockLength === 0) {
        this._timeOffset = 0;
      } else {
        this._timeOffset += this._timeStep;
      }
      return span;
    }

    prePareText() {
      if (!this._element) {
        return;
      }
      const text = this._element.textContent
        .trim()
        .split(` `)
        .filter((letter) => letter !== ``);

      const content = text.reduce((fragmentParent, word) => {
        const lettersArr = Array.from(word);
        const wordElement = lettersArr.reduce((fragment, letter, index) => {
          fragment.appendChild(this.createElement(letter, index));
          return fragment;
        }, document.createDocumentFragment());
        const wordContainer = document.createElement(`span`);
        wordContainer.classList.add(`text-word`);
        wordContainer.appendChild(wordElement);
        fragmentParent.appendChild(wordContainer);
        return fragmentParent;
      }, document.createDocumentFragment());

      this._element.innerHTML = ``;
      this._element.appendChild(content);
    }

    runAnimation() {
      if (!this._element) {
        return;
      }
      this._element.classList.add(this._classForActivate);
    }

    destroyAnimation() {
      this._element.classList.remove(this._classForActivate);
    }

    revertElement() {
      this._element.innerHTML = ``;
      this._element.textContent = this._initText;
      this.destroyAnimation();
    }
  }

  let animationRulesTitle;
  const runRulesTitleAnimation = () => {
    const screenRules = document.querySelector(`.screen--rules`);
    animationRulesTitle = new TextAnimationManager({
      element: screenRules.querySelector(`.rules__title`),
    });
    setTimeout(() => {
      animationRulesTitle.runAnimation();
    }, 500);
  };

  if (location.hash === `#rules`) {
    runRulesTitleAnimation();
  }

  window.addEventListener(`hashchange`, () => {
    if (location.hash === `#rules`) {
      runRulesTitleAnimation();
    } else {
      if (animationRulesTitle) {
        animationRulesTitle.revertElement();
      }
    }
  });
};
