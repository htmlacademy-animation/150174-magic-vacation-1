export default () => {
  const RESULTS = {
    victory: [`result`, `result2`],
    lose: [`result3`],
  };

  const findAnimateNode = (id) => document.getElementById(`#${id}`);

  const createAnimateNode = (id, attributes, nodeName = `animate`) => {
    let animateNode = findAnimateNode(id);
    if (animateNode) {
      animateNode.remove();
    }

    animateNode = document.createElementNS(`http://www.w3.org/2000/svg`, nodeName);
    animateNode.setAttribute(`id`, id);
    Object.entries(attributes).forEach(([attribute, value]) => {
      animateNode.setAttribute(attribute, value);
    });
    return animateNode;
  };

  const COMMON_ATTRIBUTES = {
    begin: `indefinite`,
    fill: `freeze`,
    calcMode: `paced`,
  };

  const setDrawingAnimation = (path, i) => {
    const pathLength = path.getTotalLength();
    path.setAttribute(`stroke-dasharray`, pathLength);
    path.setAttribute(`stroke-dashoffset`, pathLength);
    const attributes = Object.assign({
      attributeName: `stroke-dashoffset`,
      from: pathLength,
      to: 0,
      dur: `0.8s`,
    }, COMMON_ATTRIBUTES);
    const id = `drawing_${i}`;
    const node = createAnimateNode(id, attributes);
    path.appendChild(node);
    return node;
  };

  const setBounceAnimation = (path, i) => {
    const attributes = Object.assign({
      values: `0, -${70 + i}; 0, ${15 + i}; 0, -${10 + i}; 0, ${i + 2}; 0`,
      keyTimes: `0; 0.3; 0.75; 0.85; 1`,
      keySplines: `0.1, 0, 0.5, 1; 0.33, 0, 0.67, 1; 0.33, 0, 0.67, 1; 0.5, 0, 0.8, 1`,
      dur: `1s`,
    }, COMMON_ATTRIBUTES);
    const id = `bounce_${i}`;
    const node = createAnimateNode(id, attributes, `animateMotion`);
    path.appendChild(node);
    return node;
  };

  const createResultAnimation = (svgEl, result) => {
    const paths = Array.from(svgEl.querySelectorAll(`path`));
    paths.forEach((path, i) => {
      const animateDrawingNode = setDrawingAnimation(path, i);
      if (RESULTS.victory.includes(result)) {
        animateDrawingNode.beginElement();
      } else {
        const animateBounceNode = setBounceAnimation(path, i);
        const delay = i * 10;
        setTimeout(() => {
          animateDrawingNode.beginElement();
          animateBounceNode.beginElement();
        }, i * delay);
      }
    });
  };

  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        let targetEl = [].slice.call(results).filter(function (el) {
          return el.getAttribute(`id`) === target;
        })[0];
        targetEl.classList.add(`screen--show`);
        targetEl.classList.remove(`screen--hidden`);
        const svg = targetEl.querySelector(`.result__svg`);
        createResultAnimation(svg, target);
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();
      });
    }
  }
};
