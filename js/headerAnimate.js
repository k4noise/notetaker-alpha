const animateHeader = () => {
  const headerNode = document.querySelector('.main-section__header');
  let header = headerNode.innerHTML;
  headerNode.innerHTML = '';
  let clear = setInterval(() => {
    if (header.length) {
      headerNode.innerHTML += header.slice(0, 1);
      header = header.slice(1, header.length);
    } else clearInterval(clear);
  }, 140);
};

animateHeader();
