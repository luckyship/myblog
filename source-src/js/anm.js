function init() {
  var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;
  let obj = {};

  // Main
  initHeader();
  addListeners();

  function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = {
      x: 0,
      y: height
    };

    largeHeader = document.getElementById('container');
    largeHeader.style.height = height + 'px';

    canvas = document.getElementById('anm-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create particles
    circles = [];
    for (var x = 0; x < width * 0.5; x++) {
      var c = new Circle();
      circles.push(c);
    }
    animate();
  }

  function scrollToc() {
    if (document.querySelector('#toc')) {
      let titles = Array.from(document.querySelectorAll('article h1,article h2,article h3,article h4,article h5,article h6'));
      // 全屏滚动条出自container元素
      let scrollTop = document.querySelector('#container').scrollTop;
      let matchTitle = titles.find((title) => scrollTop <= title.offsetTop + 31);
      matchTitle = matchTitle && matchTitle.innerText;

      // 左侧导航栏
      let tocs = Array.from(document.querySelectorAll('#toc .toc-text'));
      let matchToc = tocs.find(toc => toc.innerText === matchTitle);

      if (matchToc) {
        let parentNode = matchToc.parentNode
        tocs.forEach(toc => toc.parentNode.classList.remove("toc-link-active"))
        parentNode.classList.add("toc-link-active");

        let currentTop = document.querySelector('.left-col').scrollTop
        obj.currentTop = currentTop;
        obj.activeOffsetTop = parentNode.offsetTop;

        if (!window.req && obj.currentTop !== obj.activeOffsetTop) {
          requestAnimationFrame(scrollToToc.bind(obj));
          window.req = true;
        }
      }
    }
  }

  function scrollToToc() {
    let currentTop = document.querySelector('.left-col').scrollTop;
    let diff = this.activeOffsetTop - this.currentTop;

    let targetPosition = diff > 0 ? Math.min(currentTop + diff / 10, this.activeOffsetTop) : Math.max(currentTop + diff / 10, this.activeOffsetTop)
    // document.querySelector('.left-col').scrollTo(0, targetPosition);
    // 兼容edge
    document.querySelector('.left-col').scrollTop = targetPosition;
    // 最大滚动的距离
    let maxHeight = document.querySelector('.left-col').scrollHeight - document.querySelector('.left-col').offsetHeight;

    // targetPosition < maxHeight -> 超过滚动距离停止动画
    if (targetPosition !== this.activeOffsetTop && targetPosition < maxHeight) {
      requestAnimationFrame(scrollToToc.bind(this))
    } else {
      window.req = false;
    }
  }

  // Event handling
  function addListeners() {
    window.addEventListener('scroll', scrollCheck);
    document.querySelector('#container').addEventListener('scroll', scrollToc);
    window.addEventListener('resize', resize);
  }

  function scrollCheck() {
    if (document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
  }

  function animate() {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (var i in circles) {
        circles[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }

  // Canvas manipulation
  function Circle() {
    var _this = this;

    // constructor
    (function () {
      _this.pos = {};
      init();
      //console.log(_this);
    })();

    function init() {
      _this.pos.x = Math.random() * width;
      _this.pos.y = height + Math.random() * 100;
      _this.alpha = 0.1 + Math.random() * 0.3;
      _this.scale = 0.1 + Math.random() * 0.3;
      _this.velocity = Math.random();
    }

    this.draw = function () {
      if (_this.alpha <= 0) {
        init();
      }
      _this.pos.y -= _this.velocity;
      _this.alpha -= 0.0005;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha + ')';
      ctx.fill();
    };
  }
}

module.exports = {
  init: init
}
