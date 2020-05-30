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
      if ((index + 1) % this._letterBlockLength === 0) {
        this._timeOffset = 0;
      } else {
        this._timeOffset += this._timeStep;
      }

      span.style.transition = `${this._property} ${this._timer}ms ease ${this._timeOffset}ms`;

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

  const TEXT_ANIMATION_LOCATIONS = {
    rules: `#rules`,
    intro: `#top`,
  };

  const TEXT_ANIMATION_SCREEN_NAMES = {
    rules: `rules`,
    intro: `top`,
  };

  const runAnimation = (screenClassName, elementClassName, timeout = 500) => {
    const screenRules = document.querySelector(`.${screenClassName}`);
    const animationManager = new TextAnimationManager({
      element: screenRules.querySelector(`.${elementClassName}`),
    });
    setTimeout(() => {
      animationManager.runAnimation();
    }, timeout);
    return animationManager;
  };

  let rulesTitleManager;
  let introTitleManager;
  let introDateManager;
  const runRulesTitleAnimation = () => {
    rulesTitleManager = runAnimation(`screen--rules`, `rules__title`);
    return rulesTitleManager;
  };
  const runIntroAnimation = () => {
    introTitleManager = runAnimation(`screen--intro`, `intro__title`);
    introDateManager = runAnimation(`screen--intro`, `intro__date`, 1000);
    return [introTitleManager, introDateManager];
  };

  const managers = [rulesTitleManager, introTitleManager, introDateManager];
  const revertAnimations = () => {
    managers.forEach((manager) => manager && manager.revertElement());
  };

  const onScreenChange = (evt) => {
    const {detail} = evt;
    if (detail.screenName === TEXT_ANIMATION_SCREEN_NAMES.rules) {
      runRulesTitleAnimation();
      if (introTitleManager && introDateManager) {
        introTitleManager.revertElement();
        introDateManager.revertElement();
      }
    } else if (detail.screenName === TEXT_ANIMATION_SCREEN_NAMES.intro) {
      runIntroAnimation();
      if (rulesTitleManager) {
        rulesTitleManager.revertElement();
      }
    } else {
      revertAnimations();
    }
  };

  document.body.addEventListener(`screenChanged`, onScreenChange);

  switch (location.hash) {
    case TEXT_ANIMATION_LOCATIONS.rules:
      runRulesTitleAnimation();
      return;

    case TEXT_ANIMATION_LOCATIONS.intro:
    default:
      runIntroAnimation();
      return;
  }
};
