/* IntersectionObserver: .reveal → opacity 0→1 + translateY(24px→0) */
(function () {
  var revealAll = function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  };

  // 1) prefers-reduced-motion: reduce → 全 reveal 即時可視
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
    return;
  }

  // 2) IntersectionObserver で順次フェードイン
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el);
  });

  // 3) Hero は load 直後に必ず可視化（撮影/初回描画レース対策）
  window.addEventListener('load', function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  });

  // 4) sticky nav scrolled state
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 4) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 5) hero video のループ継ぎ目をフェードで隠す
  var heroVid = document.querySelector('.hero-bg-video');
  if (heroVid) {
    // 再生速度を 1/2 に（duration 5.03s → ループ周期 約10秒）
    // FADE_* は video内秒。playbackRate 0.5 のため実時間ではこの値の 2 倍かかる
    var PLAYBACK_RATE = 0.5;
    var FADE_OUT = 0.5; // video内 0.5 秒（実時間 1.0 秒）
    var FADE_IN  = 0.5; // video内 0.5 秒（実時間 1.0 秒）
    var MAX_OP   = 0.55; // CSS の hero-bg-image と同じ最大 opacity
    heroVid.playbackRate = PLAYBACK_RATE;
    heroVid.addEventListener('loadedmetadata', function () {
      heroVid.playbackRate = PLAYBACK_RATE;
    });
    heroVid.style.transition = 'opacity 0s';
    var updateOpacity = function () {
      var d = heroVid.duration;
      if (!d || isNaN(d)) return;
      var t = heroVid.currentTime;
      var ratio;
      if (t > d - FADE_OUT) {
        ratio = Math.max(0, (d - t) / FADE_OUT);
      } else if (t < FADE_IN) {
        ratio = Math.min(1, t / FADE_IN);
      } else {
        ratio = 1;
      }
      heroVid.style.opacity = (ratio * MAX_OP).toFixed(3);
    };
    heroVid.addEventListener('timeupdate', updateOpacity);
    heroVid.addEventListener('seeked', updateOpacity);
    heroVid.addEventListener('loadedmetadata', updateOpacity);
  }

  // 7) nav active section highlight
  var navLinkMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').replace('#', '');
    if (id) navLinkMap[id] = a;
  });

  var sections = document.querySelectorAll('section[id]');
  if (sections.length && Object.keys(navLinkMap).length) {
    var setActive = function (id) {
      Object.keys(navLinkMap).forEach(function (k) {
        navLinkMap[k].classList.toggle('active', k === id);
      });
    };

    var navIO = new IntersectionObserver(function (entries) {
      // 最も交差比率が高い section を選ぶ
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (visible.length === 0) return;
      visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      var topId = visible[0].target.id;
      if (navLinkMap[topId]) setActive(topId);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    sections.forEach(function (s) { navIO.observe(s); });
  }
})();
