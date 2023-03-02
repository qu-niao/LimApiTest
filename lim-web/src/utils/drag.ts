let draging = false;
let dragDom: HTMLElement | null;
let dragpoint: { x: number; y: number };
document.addEventListener('mousedown', (ev: MouseEvent) => {
  let target = ev.target as HTMLElement;
  //根据标题栏的dom找到控制弹窗组件布局位置的dom，ant-design的弹窗组件的外壳在标题栏的父级第3层
  if (target.classList.contains('ant-modal-title')) {
    dragDom = target.parentElement?.parentElement?.parentElement as HTMLElement;
  } else if (target.classList.contains('ant-notification-notice-message')) {
    dragDom = target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement;
  } else if (target.parentElement?.classList?.contains('ant-notification-notice-message')) {
    dragDom = target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement as HTMLElement;
    //    target.parentElement?.parentElement?.classList.contains('user-cfg-but')
  } else if (target.parentElement?.classList.contains('user-cfg-but')) {
    dragDom = target.parentElement;
  } else if (target.parentElement?.parentElement?.classList.contains('user-cfg-but')) {
    dragDom = target.parentElement?.parentElement;
  } else {
    return;
  }
  //由于此拖拽法对所有弹窗有效，通过classname标注控制动作取消
  if (dragDom.parentElement?.classList.contains('nodrag')) {
    dragDom = null;
    return;
  }
  draging = true;
  dragpoint = {
    x: ev.clientX,
    y: ev.clientY,
  };
});

document.addEventListener('mouseup', () => {
  draging = false;
  dragDom = null;
});
document.addEventListener('mousemove', (ev: MouseEvent) => {
  if (draging) {
    let _dragdom = dragDom as HTMLElement;
    let sty = window.getComputedStyle(_dragdom, null);
    _dragdom.style.marginLeft = `${parseFloat(sty.marginLeft) + ev.clientX - dragpoint.x}px`;
    _dragdom.style.marginTop = `${parseFloat(sty.marginTop) + ev.clientY - dragpoint.y}px`;
    dragpoint = {
      x: ev.clientX,
      y: ev.clientY,
    };
  }
});

export {};
