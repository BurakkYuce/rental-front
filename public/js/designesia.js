/* --------------------------------------------------
 * Â© Copyright 2025 - Rentaly by Designesia
 * --------------------------------------------------*/
(function ($) {
  "use strict";

  var rtl_mode = "off"; // on - for enable RTL, off - for deactive RTL
  var preloader = "on"; // on - for enable preloader, off - for disable preloader
  var preloader_custom_image = "off"; // insert image url to enable custom image, off - for disable custom image
  var loading_text = "Loading..."; // text for preloader. If you don't use text just leave it blank
  var loading_text_position = "0px"; // set position for loading text. Default value is 0px

  /* predefined vars begin */
  var mobile_menu_show = 0;
  var v_count = "0";
  var mb;
  var instances = [];
  var $window = $(window);
  var $op_header_autoshow = 0;
  var grid_size = 10;
  /* predefined vars end */

  function initializeLoader() {
    // Loader container'ı oluştur
    const loaderContainer = $("<div/>")
      .addClass("page-loader")
      .attr("id", "pageLoader");

    // Özel resim kullanımı kontrolü
    if (typeof useCustomImage !== "undefined" && useCustomImage === true) {
      // Özel resim ile loader
      const customImageLoader = $("<div/>")
        .addClass("custom-image-container")
        .append(
          $("<div/>")
            .addClass("image-wrapper")
            .append(
              $("<img/>")
                .attr("src", customLoaderImage)
                .addClass("loader-image")
                .attr("alt", "Loading...")
            )
        );

      // Yükleme metni ekle
      if (typeof loaderText !== "undefined" && loaderText) {
        customImageLoader.append(
          $("<div/>").addClass("loader-message").text(loaderText)
        );
      }

      loaderContainer.append(customImageLoader);
    } else {
      // Varsayılan animasyonlu loader
      const animatedLoader = $("<div/>")
        .addClass("animated-loader")
        .append(
          $("<div/>")
            .addClass("spinner-container")
            .append($("<div/>").addClass("spinner-ring ring-1"))
            .append($("<div/>").addClass("spinner-ring ring-2"))
            .append($("<div/>").addClass("spinner-ring ring-3"))
        )
        .append(
          $("<div/>")
            .addClass("pulse-dots")
            .append($("<span/>").addClass("dot dot-1"))
            .append($("<span/>").addClass("dot dot-2"))
            .append($("<span/>").addClass("dot dot-3"))
        );

      // Yükleme metni ekle
      if (typeof loaderText !== "undefined" && loaderText) {
        animatedLoader.append(
          $("<div/>").addClass("loader-message").text(loaderText)
        );
      }

      loaderContainer.append(animatedLoader);
    }

    // Loader'ı sayfaya ekle
    $("body").prepend(loaderContainer);

    // Metin pozisyonu ayarla
    if (typeof textPosition !== "undefined" && textPosition) {
      $(".loader-message").css("margin-top", textPosition);
    }

    // Loader'ı göster
    $("#pageLoader").fadeIn(300);
  }

  // Loader'ı kaldırma fonksiyonu
  function removeLoader() {
    $("#pageLoader").fadeOut(400, function () {
      $(this).remove();
    });
  }

  // Loader durumunu kontrol etme
  function isLoaderActive() {
    return $("#pageLoader").length > 0;
  }

  // Otomatik başlatma (isteğe bağlı)
  $(document).ready(function () {
    if (typeof autoStartLoader !== "undefined" && autoStartLoader === true) {
      initializeLoader();
    }
  });

  // CSS stilleri (JavaScript içinde dinamik olarak eklenir)
  function addLoaderStyles() {
    const styles = `
    <style>
      .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(2px);
      }
      
      .custom-image-container {
        text-align: center;
      }
      
      .image-wrapper {
        margin-bottom: 20px;
      }
      
      .loader-image {
        max-width: 100px;
        max-height: 100px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .animated-loader {
        text-align: center;
      }
      
      .spinner-container {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
      }
      
      .spinner-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-radius: 50%;
        animation: spin 2s linear infinite;
      }
      
      .ring-1 { 
        border-top-color: #3498db; 
        animation-duration: 1.5s;
      }
      
      .ring-2 { 
        border-right-color: #e74c3c; 
        animation-duration: 2s;
        animation-direction: reverse;
      }
      
      .ring-3 { 
        border-bottom-color: #2ecc71; 
        animation-duration: 2.5s;
      }
      
      .pulse-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 20px;
      }
      
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #34495e;
        animation: pulse 1.4s ease-in-out infinite both;
      }
      
      .dot-1 { animation-delay: -0.32s; }
      .dot-2 { animation-delay: -0.16s; }
      .dot-3 { animation-delay: 0s; }
      
      .loader-message {
        font-family: Arial, sans-serif;
        font-size: 16px;
        color: #34495e;
        font-weight: 500;
        margin-top: 15px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
    </style>
  `;

    if (!$("#loader-styles").length) {
      $("head").append(styles);
    }
  }

  // Stilleri otomatik ekle
  $(document).ready(function () {
    addLoaderStyles();
  });
  initializeLoader();

  removeLoader();

  /* --------------------------------------------------
   * header | sticky
   * --------------------------------------------------*/
  function header_sticky() {
    jQuery("header").addClass("clone", 1000, "easeOutBounce");
    var $document = $(document);
    var vscroll = 0;
    var header = jQuery("header.autoshow");
    if ($document.scrollTop() >= 50 && vscroll == 0) {
      header.removeClass("scrollOff");
      header.addClass("scrollOn");
      header.css("height", "auto");
      vscroll = 1;
    } else {
      header.removeClass("scrollOn");
      header.addClass("scrollOff");
      vscroll = 0;
    }
  }
  var useCustomImage = false; // true/false
  var customLoaderImage = "path/to/image.png";
  var loaderText = "Yükleniyor...";
  var textPosition = "20px";
  var autoStartLoader = true;

  // Başlatma
  initializeLoader();
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  delay(500).then(() => {
    removeLoader();
  });
  // Kaldırma
  removeLoader();

  /* --------------------------------------------------
   * plugin | magnificPopup
   * --------------------------------------------------*/
  // MagnificPopup'ı tamamen değiştiren fonksiyon
  function load_magnificPopup() {
    // Eski MagnificPopup CSS'ini devre dışı bırak
    $('link[href*="magnific-popup"], link[href*="magnific"]').each(function () {
      this.disabled = true;
    });

    // Eski MagnificPopup elementlerini temizle
    $(".mfp-bg, .mfp-wrap, .mfp-container").remove();

    // Yeni lightbox HTML'ini oluştur
    createReplacementLightbox();

    // Popup'ları başlat
    initAllPopups();
  }

  function createReplacementLightbox() {
    // Eski lightbox varsa kaldır
    $("#replacement-lightbox").remove();

    const lightboxHTML = `
    <div id="replacement-lightbox" style="display: none;">
      <div class="rl-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999999;
        cursor: pointer;
      "></div>
      
      <div class="rl-container" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div class="rl-content" style="
          position: relative;
          max-width: 90%;
          max-height: 90%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        ">
          <button class="rl-close" style="
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background: rgba(0, 0, 0, 0.7);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 18px;
            cursor: pointer;
            z-index: 10;
          ">&times;</button>
          
          <div class="rl-inner"></div>
          
          <button class="rl-prev" style="
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            cursor: pointer;
            display: none;
          ">‹</button>
          
          <button class="rl-next" style="
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            cursor: pointer;
            display: none;
          ">›</button>
          
          <div class="rl-counter" style="
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
          "></div>
        </div>
      </div>
    </div>
  `;

    $("body").append(lightboxHTML);

    // Event listeners
    $("#replacement-lightbox .rl-close, #replacement-lightbox .rl-overlay").on(
      "click",
      closeLightbox
    );
    $("#replacement-lightbox .rl-prev").on("click", prevImage);
    $("#replacement-lightbox .rl-next").on("click", nextImage);

    // Keyboard events
    $(document).on("keydown.replacement-lightbox", function (e) {
      if ($("#replacement-lightbox").is(":visible")) {
        switch (e.key) {
          case "Escape":
            closeLightbox();
            break;
          case "ArrowLeft":
            prevImage();
            break;
          case "ArrowRight":
            nextImage();
            break;
        }
      }
    });
  }

  // Global variables
  let currentGallery = [];
  let currentIndex = 0;
  // Geliştirilmiş Popup Handler'ları
  const PopupHandlers = {
    // Popup türleri için konfigürasyon
    config: {
      ajax: {
        selectors: [".simple-ajax-popup", ".simple-ajax-popup-align-top"],
        handler: "handleAjaxPopup",
      },
      image: {
        selectors: [
          ".image-popup",
          ".image-popup-vertical-fit",
          ".image-popup-fit-width",
          ".image-popup-no-margins",
        ],
        handler: "handleImagePopup",
      },
      video: {
        selectors: [".popup-youtube", ".popup-vimeo"],
        handler: "handleVideoPopup",
      },
      gallery: {
        selectors: [
          ".zoom-gallery",
          ".image-popup-gallery",
          ".images-group",
          ".images-popup",
        ],
        handler: "handleGalleryPopup",
      },
    },

    // Ana başlatma fonksiyonu
    init() {
      Object.keys(this.config).forEach((type) => {
        const config = this.config[type];
        config.selectors.forEach((selector) => {
          this.bindPopupEvents(selector, this[config.handler].bind(this));
        });
      });
    },

    // Event binding helper
    bindPopupEvents(selector, handler) {
      $(selector).off("click.popup").on("click.popup", handler);
    },

    // Ajax popup handler
    handleAjaxPopup(e) {
      e.preventDefault();
      const url = $(e.currentTarget).attr("href");
      const isAlignTop = $(e.currentTarget).hasClass(
        "simple-ajax-popup-align-top"
      );

      this.openPopup("ajax", { url, alignTop: isAlignTop });
    },

    // Image popup handler
    handleImagePopup(e) {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const src = $target.attr("href") || $target.find("img").attr("src");
      const title = $target.attr("title") || $target.find("img").attr("alt");

      this.openPopup("image", { src, title });
    },

    // Video popup handler
    handleVideoPopup(e) {
      e.preventDefault();
      const url = $(e.currentTarget).attr("href");

      this.openPopup("video", { url });
    },

    // Gallery popup handler
    handleGalleryPopup(e) {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const $container = $target.closest(
        ".zoom-gallery, .image-popup-gallery, .images-group, .images-popup"
      );

      const images = this.extractGalleryImages($container);
      const index = $container.find("a").index($target);

      this.openPopup("gallery", { images, index });
    },

    // Gallery resimlerini çıkar
    extractGalleryImages($container) {
      return $container
        .find("a")
        .map(function () {
          return {
            src: $(this).attr("href"),
            title: $(this).attr("title") || $(this).find("img").attr("alt"),
          };
        })
        .get();
    },

    // Popup açma işlemi
    openPopup(type, data) {
      switch (type) {
        case "ajax":
          this.openAjaxPopup(data.url, data.alignTop);
          break;
        case "image":
          this.openImagePopup(data.src, data.title);
          break;
        case "video":
          this.openVideoPopup(data.url);
          break;
        case "gallery":
          this.openGalleryPopup(data.images, data.index);
          break;
      }
    },

    // Ajax popup açma
    openAjaxPopup(url, alignTop = false) {
      const $lightbox = $("#replacement-lightbox");
      const $inner = $lightbox.find(".rl-inner");

      // Loading göster
      $inner.html(this.createLoader("İçerik yükleniyor..."));
      this.showLightbox();

      // Align top sınıfı ekle
      if (alignTop) {
        $lightbox.addClass("align-top");
      }

      // Ajax request
      $.ajax({
        url: url,
        method: "GET",
        timeout: 10000,
        success: (data) => {
          $inner.html(this.wrapContent(data));
        },
        error: (xhr, status, error) => {
          const errorMsg =
            status === "timeout"
              ? "Zaman aşımı - Tekrar deneyin"
              : "İçerik yüklenemedi";
          $inner.html(this.createError(errorMsg));
        },
      });
    },

    // Image popup açma
    openImagePopup(src, title) {
      const $lightbox = $("#replacement-lightbox");
      const $inner = $lightbox.find(".rl-inner");

      $inner.html(this.createLoader("Resim yükleniyor..."));
      this.showLightbox();

      // Resmi preload et
      const img = new Image();
      img.onload = () => {
        $inner.html(this.createImageContent(src, title));
      };
      img.onerror = () => {
        $inner.html(this.createError("Resim yüklenemedi"));
      };
      img.src = src;
    },

    // Video popup açma
    openVideoPopup(url) {
      const $lightbox = $("#replacement-lightbox");
      const $inner = $lightbox.find(".rl-inner");

      const embedUrl = this.getEmbedUrl(url);
      $inner.html(this.createVideoContent(embedUrl));
      this.showLightbox();
    },

    // Gallery popup açma
    openGalleryPopup(images, startIndex) {
      if (!images || images.length === 0) return;

      window.currentGallery = images;
      window.currentIndex = startIndex;

      this.updateGalleryContent();
      this.showLightbox();
      this.showGalleryControls();
    },

    // Content wrapper'ları
    wrapContent(content) {
      return `<div class="ajax-content" style="padding: 20px; max-height: 80vh; overflow-y: auto;">${content}</div>`;
    },

    createImageContent(src, title) {
      return `
      <div class="image-content">
        <img src="${src}" alt="${title}" style="max-width: 100%; max-height: 80vh; display: block; margin: 0 auto;">
        ${
          title
            ? `<div class="image-title" style="padding: 10px; text-align: center; background: #f5f5f5; font-size: 14px;">${title}</div>`
            : ""
        }
      </div>
    `;
    },

    createVideoContent(embedUrl) {
      return `
      <div class="video-content">
        <iframe src="${embedUrl}" 
          style="width: 80vw; height: 45vw; max-width: 900px; max-height: 506px; border: none;" 
          frameborder="0" allowfullscreen>
        </iframe>
      </div>
    `;
    },

    createLoader(message) {
      return `
      <div class="popup-loader" style="padding: 40px; text-align: center;">
        <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div>${message}</div>
      </div>
    `;
    },

    createError(message) {
      return `
      <div class="popup-error" style="padding: 40px; text-align: center; color: #e74c3c;">
        <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
        <div>${message}</div>
      </div>
    `;
    },

    // Gallery işlemleri
    updateGalleryContent() {
      const current = window.currentGallery[window.currentIndex];
      const $lightbox = $("#replacement-lightbox");
      const $inner = $lightbox.find(".rl-inner");
      const $counter = $lightbox.find(".rl-counter");

      $inner.html(this.createImageContent(current.src, current.title));
      $counter.text(
        `${window.currentIndex + 1} / ${window.currentGallery.length}`
      );
    },

    showGalleryControls() {
      const $lightbox = $("#replacement-lightbox");
      if (window.currentGallery.length > 1) {
        $lightbox.find(".rl-prev, .rl-next, .rl-counter").show();
      }
    },

    // Lightbox göster/gizle
    showLightbox() {
      const $lightbox = $("#replacement-lightbox");
      $lightbox.show().css("opacity", "1");
      $("body").css("overflow", "hidden");
    },

    closeLightbox() {
      const $lightbox = $("#replacement-lightbox");
      $lightbox.hide().removeClass("align-top");
      $("body").css("overflow", "");

      // Reset state
      window.currentGallery = [];
      window.currentIndex = 0;
      $lightbox.find(".rl-prev, .rl-next, .rl-counter").hide();
      $lightbox.find("iframe").attr("src", ""); // Stop videos
    },

    // Gallery navigation
    nextImage() {
      if (window.currentGallery.length > 0) {
        window.currentIndex =
          (window.currentIndex + 1) % window.currentGallery.length;
        this.updateGalleryContent();
      }
    },

    prevImage() {
      if (window.currentGallery.length > 0) {
        window.currentIndex =
          window.currentIndex > 0
            ? window.currentIndex - 1
            : window.currentGallery.length - 1;
        this.updateGalleryContent();
      }
    },

    // URL embed helper
    getEmbedUrl(url) {
      // YouTube
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.includes("youtu.be")
          ? url.split("youtu.be/")[1].split("?")[0]
          : url.split("v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      // Vimeo
      if (url.includes("vimeo.com")) {
        const videoId = url.split("vimeo.com/")[1].split("?")[0];
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }

      return url;
    },
  };

  // Global fonksiyonlar (eski kodla uyumluluk için)
  function initAllPopups() {
    PopupHandlers.init();
  }

  function openAjaxPopup(url) {
    PopupHandlers.openAjaxPopup(url);
  }

  function openImagePopup(src, title) {
    PopupHandlers.openImagePopup(src, title);
  }

  function openVideoPopup(url) {
    PopupHandlers.openVideoPopup(url);
  }

  function openGallery(images, startIndex) {
    PopupHandlers.openGalleryPopup(images, startIndex);
  }

  function updateGalleryImage() {
    PopupHandlers.updateGalleryContent();
  }

  function showLightbox() {
    PopupHandlers.showLightbox();
  }

  function closeLightbox() {
    PopupHandlers.closeLightbox();
  }

  function nextImage() {
    PopupHandlers.nextImage();
  }

  function prevImage() {
    PopupHandlers.prevImage();
  }

  function getEmbedUrl(url) {
    return PopupHandlers.getEmbedUrl(url);
  }

  // Compatibility functions
  function magnificPopup() {
    return {
      open: function (options) {
        if (options.items && options.items[0]) {
          PopupHandlers.openImagePopup(
            options.items[0].src,
            options.items[0].title
          );
        }
      },
      close: PopupHandlers.closeLightbox,
    };
  }

  // jQuery plugin compatibility
  $.fn.magnificPopup = function (options) {
    this.addClass("replacement-popup-initialized");
    PopupHandlers.init();
    return this;
  };

  // CSS animasyon
  const style = document.createElement("style");
  style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
  document.head.appendChild(style);
  // Modern Carousel Sistemi - Owl Carousel Alternatifi
  class ModernCarousel {
    constructor(element, options = {}) {
      this.element = $(element);
      this.items = this.element.find(".carousel-item");
      this.currentIndex = 0;
      this.isAnimating = false;

      // Varsayılan ayarlar
      this.settings = {
        items: 1,
        loop: true,
        autoplay: false,
        autoplayTimeout: 3000,
        nav: true,
        dots: true,
        margin: 10,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 },
        },
        ...options,
      };

      this.init();
    }

    init() {
      this.setupCarousel();
      this.setupControls();
      this.setupResponsive();
      this.setupAutoplay();
      this.bindEvents();
    }

    setupCarousel() {
      const wrapper = $('<div class="carousel-wrapper"></div>');
      const track = $('<div class="carousel-track"></div>');

      // Items'ları track'e taşı
      this.items.appendTo(track);
      track.appendTo(wrapper);
      wrapper.appendTo(this.element);

      this.wrapper = wrapper;
      this.track = track;

      this.updateLayout();
    }

    setupControls() {
      // Navigation arrows
      if (this.settings.nav) {
        const navHTML = `
        <button class="carousel-nav carousel-prev" aria-label="Previous">
          <i class="fa fa-chevron-left"></i>
        </button>
        <button class="carousel-nav carousel-next" aria-label="Next">
          <i class="fa fa-chevron-right"></i>
        </button>
      `;
        this.element.append(navHTML);
      }

      // Dots
      if (this.settings.dots) {
        const dotsHTML = $('<div class="carousel-dots"></div>');
        const totalSlides = Math.ceil(
          this.items.length / this.getCurrentItemsPerSlide()
        );

        for (let i = 0; i < totalSlides; i++) {
          dotsHTML.append(
            `<button class="carousel-dot ${
              i === 0 ? "active" : ""
            }" data-slide="${i}"></button>`
          );
        }

        this.element.append(dotsHTML);
      }
    }

    setupResponsive() {
      $(window).on("resize", () => {
        this.updateLayout();
      });
    }

    setupAutoplay() {
      if (this.settings.autoplay) {
        this.startAutoplay();
      }
    }

    bindEvents() {
      // Navigation
      this.element.on("click", ".carousel-prev", () => this.prev());
      this.element.on("click", ".carousel-next", () => this.next());

      // Dots
      this.element.on("click", ".carousel-dot", (e) => {
        const slide = parseInt($(e.target).data("slide"));
        this.goToSlide(slide);
      });

      // Touch events
      this.setupTouchEvents();
    }

    setupTouchEvents() {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      this.track.on("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      });

      this.track.on("touchmove", (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;

        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.next();
          } else {
            this.prev();
          }
          isDragging = false;
        }
      });

      this.track.on("touchend", () => {
        isDragging = false;
      });
    }

    getCurrentItemsPerSlide() {
      const width = $(window).width();
      const responsive = this.settings.responsive;

      let itemsPerSlide = this.settings.items;

      Object.keys(responsive).forEach((breakpoint) => {
        if (width >= parseInt(breakpoint)) {
          itemsPerSlide = responsive[breakpoint].items;
        }
      });

      return itemsPerSlide;
    }

    updateLayout() {
      const itemsPerSlide = this.getCurrentItemsPerSlide();
      const totalItems = this.items.length;
      const itemWidth =
        100 / itemsPerSlide - this.settings.margin / itemsPerSlide;

      this.items.css({
        width: `${itemWidth}%`,
        "margin-right": `${this.settings.margin}px`,
        display: "inline-block",
        "vertical-align": "top",
      });

      this.track.css({
        width: `${(totalItems * 100) / itemsPerSlide}%`,
        display: "flex",
        transition: "transform 0.3s ease",
      });

      this.goToSlide(this.currentIndex);
    }

    next() {
      if (this.isAnimating) return;

      const itemsPerSlide = this.getCurrentItemsPerSlide();
      const maxIndex = Math.ceil(this.items.length / itemsPerSlide) - 1;

      if (this.currentIndex >= maxIndex) {
        if (this.settings.loop) {
          this.goToSlide(0);
        }
      } else {
        this.goToSlide(this.currentIndex + 1);
      }
    }

    prev() {
      if (this.isAnimating) return;

      const itemsPerSlide = this.getCurrentItemsPerSlide();
      const maxIndex = Math.ceil(this.items.length / itemsPerSlide) - 1;

      if (this.currentIndex <= 0) {
        if (this.settings.loop) {
          this.goToSlide(maxIndex);
        }
      } else {
        this.goToSlide(this.currentIndex - 1);
      }
    }

    goToSlide(index) {
      if (this.isAnimating) return;

      this.isAnimating = true;
      this.currentIndex = index;

      const itemsPerSlide = this.getCurrentItemsPerSlide();
      const translateX = -(
        index *
        (100 / Math.ceil(this.items.length / itemsPerSlide))
      );

      this.track.css("transform", `translateX(${translateX}%)`);

      // Update dots
      this.element.find(".carousel-dot").removeClass("active");
      this.element
        .find(`.carousel-dot[data-slide="${index}"]`)
        .addClass("active");

      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    }

    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, this.settings.autoplayTimeout);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
    }

    destroy() {
      this.stopAutoplay();
      this.element.off();
      $(window).off("resize");
    }
  }

  // Responsive Media Query Handler
  class ResponsiveHandler {
    constructor() {
      this.breakpoints = {
        mobile: 992,
        tablet: 993,
      };
      this.init();
    }

    init() {
      this.setupMediaQueries();
      this.bindEvents();
    }

    setupMediaQueries() {
      // Mobile breakpoint
      const mobileQuery = window.matchMedia(
        `(max-width: ${this.breakpoints.mobile}px)`
      );
      mobileQuery.addListener(this.handleMobileChange.bind(this));
      this.handleMobileChange(mobileQuery);

      // Desktop breakpoint
      const desktopQuery = window.matchMedia(
        `(min-width: ${this.breakpoints.tablet}px)`
      );
      desktopQuery.addListener(this.handleDesktopChange.bind(this));
      this.handleDesktopChange(desktopQuery);
    }

    handleMobileChange(mq) {
      if (mq.matches) {
        // Mobile mode
        window.mobile_menu_show = 0;
        $("#menu-btn").show();
        $("header").addClass("header-mobile");

        const body = $("body");
        if (body.hasClass("side-content")) {
          body.removeClass("side-layout");
        }

        // Slider adjustments
        $(".owl-slide-wrapper img").css({
          height: $(window).innerHeight(),
          width: "auto",
        });

        if (window.$op_header_autoshow == 1) {
          $("header").removeClass("autoshow");
        }
      }
    }

    handleDesktopChange(mq) {
      if (mq.matches) {
        // Desktop mode
        window.mobile_menu_show = 1;
        $("header").removeClass("header-mobile");

        const body = $("body");
        if (body.hasClass("side-content")) {
          body.addClass("side-layout");
        }

        // Slider adjustments
        $(".owl-slide-wrapper img").css({
          width: "100%",
          height: "auto",
        });

        if (window.$op_header_autoshow == 1) {
          $("header").addClass("autoshow");
        }
      }
    }

    bindEvents() {
      $(window).on("resize", () => {
        this.handleResize();
      });
    }

    handleResize() {
      // Video autosize
      this.videoAutosize();

      // Header reset
      const header = $("header");
      header.removeClass("smaller logo-smaller clone");
    }

    videoAutosize() {
      // Video responsive handling
      $(".video-container").each(function () {
        const $container = $(this);
        const $video = $container.find("video, iframe");

        if ($video.length) {
          const containerWidth = $container.width();
          const containerHeight = $container.height();
          const aspectRatio = 16 / 9; // Default aspect ratio

          if (containerWidth / containerHeight > aspectRatio) {
            $video.css({
              width: "100%",
              height: "auto",
            });
          } else {
            $video.css({
              width: "auto",
              height: "100%",
            });
          }
        }
      });
    }
  }

  // Carousel Configurations
  const carouselConfigs = {
    "#items-carousel": {
      items: 3,
      loop: true,
      nav: true,
      dots: false,
      margin: 25,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      },
    },

    "#items-carousel-alt-2": {
      items: 3,
      loop: true,
      nav: true,
      dots: false,
      margin: 25,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 4 },
      },
    },

    "#slider-carousel": {
      items: 1,
      loop: true,
      dots: false,
      nav: false,
    },

    "#collection-carousel": {
      items: 4,
      loop: true,
      nav: true,
      dots: false,
      margin: 25,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 4 },
      },
    },

    "#collection-carousel-alt": {
      items: 5,
      loop: true,
      nav: true,
      dots: false,
      margin: 25,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 5 },
      },
    },

    "#item-carousel-big": {
      items: 3,
      loop: true,
      nav: false,
      dots: false,
      margin: 25,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      },
    },

    "#item-carousel-big-type-2": {
      items: 1,
      loop: true,
      nav: false,
      dots: false,
      margin: 25,
      autoplay: true,
      autoplayTimeout: 3000,
    },

    "#testimonial-carousel": {
      items: 3,
      loop: true,
      nav: false,
      dots: true,
      margin: 30,
      responsive: {
        0: { items: 1 },
        600: { items: 1 },
        1000: { items: 3 },
      },
    },

    "#testimonial-carousel-1-col": {
      items: 1,
      loop: true,
      nav: false,
      dots: true,
      margin: 30,
    },

    "#blog-carousel": {
      items: 3,
      loop: true,
      nav: false,
      dots: true,
      margin: 25,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      },
    },

    "#owl-logo": {
      items: 6,
      loop: true,
      nav: false,
      dots: false,
      margin: 25,
      autoplay: true,
      autoplayTimeout: 2000,
      responsive: {
        0: { items: 2 },
        600: { items: 4 },
        1000: { items: 6 },
      },
    },
  };

  // Global functions (backward compatibility)
  function init_resize() {
    // Initialize responsive handler
    new ResponsiveHandler();

    // Initialize all carousels
    load_owl();

    // Initialize other functions
    if (typeof init === "function") init();
    if (typeof init_de === "function") init_de();
  }

  function load_owl() {
    // Initialize all carousels
    Object.keys(carouselConfigs).forEach((selector) => {
      const $element = $(selector);
      if ($element.length) {
        new ModernCarousel(selector, carouselConfigs[selector]);
      }
    });

    // Custom navigation handlers
    setupCustomNavigation();
  }

  function setupCustomNavigation() {
    // Custom arrow navigation
    $(".d-arrow-right")
      .off("click")
      .on("click", function () {
        const $carousel = $(this)
          .closest(".d-carousel")
          .find(".modern-carousel");
        if ($carousel.length && $carousel.data("carousel")) {
          $carousel.data("carousel").next();
        }
      });

    $(".d-arrow-left")
      .off("click")
      .on("click", function () {
        const $carousel = $(this)
          .closest(".d-carousel")
          .find(".modern-carousel");
        if ($carousel.length && $carousel.data("carousel")) {
          $carousel.data("carousel").prev();
        }
      });

    // Thumbnail navigation
    $(".owl-thumb-item")
      .off("click")
      .on("click", function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
      });

    // Hover effects for slider
    $(".owl-slide-wrapper")
      .off("mouseenter mouseleave")
      .on({
        mouseenter: function () {
          $(".owl-slider-nav .next").css("right", "40px");
          $(".owl-slider-nav .prev").css("left", "40px");
        },
        mouseleave: function () {
          $(".owl-slider-nav .next").css("right", "-50px");
          $(".owl-slider-nav .prev").css("left", "-50px");
        },
      });
  }

  // CSS Styles
  function addCarouselStyles() {
    const styles = `
    <style id="modern-carousel-styles">
      .modern-carousel {
        position: relative;
        overflow: hidden;
      }
      
      .carousel-wrapper {
        overflow: hidden;
        width: 100%;
      }
      
      .carousel-track {
        display: flex;
        transition: transform 0.3s ease;
      }
      
      .carousel-item {
        flex-shrink: 0;
        box-sizing: border-box;
      }
      
      .carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
      }
      
      .carousel-nav:hover {
        background: rgba(0, 0, 0, 0.7);
        transform: translateY(-50%) scale(1.1);
      }
      
      .carousel-prev {
        left: 10px;
      }
      
      .carousel-next {
        right: 10px;
      }
      
      .carousel-dots {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        gap: 10px;
      }
      
      .carousel-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .carousel-dot.active {
        background: #007bff;
        transform: scale(1.2);
      }
      
      .carousel-dot:hover {
        background: rgba(0, 0, 0, 0.5);
      }
      
      @media (max-width: 768px) {
        .carousel-nav {
          width: 35px;
          height: 35px;
          font-size: 14px;
        }
        
        .carousel-prev {
          left: 5px;
        }
        
        .carousel-next {
          right: 5px;
        }
      }
    </style>
  `;

    if (!$("#modern-carousel-styles").length) {
      $("head").append(styles);
    }
  }

  // Initialize when DOM is ready
  $(document).ready(function () {
    addCarouselStyles();
  });

  // Export for global use
  window.ModernCarousel = ModernCarousel;
  window.ResponsiveHandler = ResponsiveHandler;
  // Otomatik başlatma
  init_resize(); // Eski fonksiyon aynı çalışıyor

  // Manuel başlatma
  new ModernCarousel("#my-carousel", {
    items: 3,
    loop: true,
    autoplay: true,
  });
  function filter_gallery() {
    var $container = jQuery("#gallery");
    $container.isotope({
      itemSelector: ".item",
      filter: "*",
    });
    jQuery("#filters a").on("click", function () {
      var $this = jQuery(this);
      if ($this.hasClass("selected")) {
        return false;
      }
      var $optionSet = $this.parents();
      $optionSet.find(".selected").removeClass("selected");
      $this.addClass("selected");
      var selector = jQuery(this).attr("data-filter");
      $container.isotope({
        filter: selector,
      });
      return false;
    });
  }

  function masonry() {
    var $container = jQuery(".row-masonry");
    $container.isotope({
      itemSelector: ".item",
    });
    jQuery("#filters a").on("click", function () {
      var $this = jQuery(this);
      if ($this.hasClass("selected")) {
        return false;
      }
      var $optionSet = $this.parents();
      $optionSet.find(".selected").removeClass("selected");
      $this.addClass("selected");
      var selector = jQuery(this).attr("data-filter");
      $container.isotope({
        filter: selector,
      });
      return false;
    });
  }
  // Isotope'un tam yerine geçen basit ve etkili sistem
  function filter_gallery() {
    var $container = jQuery("#gallery");

    // Container'ı hazırla
    $container.css({
      position: "relative",
      overflow: "hidden",
    });

    // İlk layout
    layoutItems($container);

    // Filter butonları
    jQuery("#filters a").on("click", function () {
      var $this = jQuery(this);
      if ($this.hasClass("selected")) {
        return false;
      }

      var $optionSet = $this.parents();
      $optionSet.find(".selected").removeClass("selected");
      $this.addClass("selected");

      var selector = jQuery(this).attr("data-filter");

      // Filtreleme işlemi
      if (selector === "*") {
        $container.find(".item").show();
      } else {
        $container.find(".item").hide();
        $container.find(".item" + selector).show();
      }

      // Layout'u yeniden hesapla
      setTimeout(function () {
        layoutItems($container);
      }, 50);

      return false;
    });

    // Resize event
    $(window).on("resize", function () {
      layoutItems($container);
    });
  }

  function masonry() {
    var $container = jQuery(".row-masonry");

    // Container'ı hazırla
    $container.css({
      position: "relative",
      overflow: "hidden",
    });

    // İlk layout
    layoutItems($container);

    // Filter butonları
    jQuery("#filters a").on("click", function () {
      var $this = jQuery(this);
      if ($this.hasClass("selected")) {
        return false;
      }

      var $optionSet = $this.parents();
      $optionSet.find(".selected").removeClass("selected");
      $this.addClass("selected");

      var selector = jQuery(this).attr("data-filter");

      // Filtreleme işlemi
      if (selector === "*") {
        $container.find(".item").show();
      } else {
        $container.find(".item").hide();
        $container.find(".item" + selector).show();
      }

      // Layout'u yeniden hesapla
      setTimeout(function () {
        layoutItems($container);
      }, 50);

      return false;
    });

    // Resize event
    $(window).on("resize", function () {
      layoutItems($container);
    });
  }

  // Layout hesaplama fonksiyonu
  function layoutItems($container) {
    var $items = $container.find(".item:visible");

    if ($items.length === 0) {
      $container.height(0);
      return;
    }

    // Masonry layout hesapla
    var containerWidth = $container.width();
    var itemWidth = $items.first().outerWidth(true);
    var columns = Math.floor(containerWidth / itemWidth);

    // Minimum 1 sütun
    if (columns < 1) columns = 1;

    var columnHeights = [];
    for (var i = 0; i < columns; i++) {
      columnHeights[i] = 0;
    }

    $items.each(function (index) {
      var $item = $(this);

      // Resim yüklenme kontrolü
      var $images = $item.find("img");
      if ($images.length > 0) {
        $images.each(function () {
          if (!this.complete) {
            $(this).one("load", function () {
              layoutItems($container);
            });
          }
        });
      }

      // En kısa sütunu bul
      var shortestColumn = 0;
      var shortestHeight = columnHeights[0];

      for (var i = 1; i < columnHeights.length; i++) {
        if (columnHeights[i] < shortestHeight) {
          shortestColumn = i;
          shortestHeight = columnHeights[i];
        }
      }

      // Pozisyon hesapla
      var x = shortestColumn * itemWidth;
      var y = columnHeights[shortestColumn];

      // Item'ı konumlandır
      $item.css({
        position: "absolute",
        left: x + "px",
        top: y + "px",
        transition: "all 0.3s ease",
      });

      // Sütun yüksekliğini güncelle
      columnHeights[shortestColumn] += $item.outerHeight(true);
    });

    // Container yüksekliğini ayarla
    var maxHeight = Math.max.apply(Math, columnHeights);
    $container.height(maxHeight);
  }

  // Smooth filter animasyonu için gelişmiş versiyon
  function smoothFilter($container, selector) {
    var $items = $container.find(".item");
    var $visibleItems = selector === "*" ? $items : $items.filter(selector);
    var $hiddenItems = $items.not($visibleItems);

    // Gizlenecek öğeleri fade out
    $hiddenItems.css({
      opacity: "0",
      transform: "scale(0.8)",
    });

    // Görünecek öğeleri fade in
    $visibleItems.css({
      opacity: "1",
      transform: "scale(1)",
    });

    // DOM'dan gizle/göster
    setTimeout(function () {
      $hiddenItems.hide();
      $visibleItems.show();

      // Layout'u yeniden hesapla
      setTimeout(function () {
        layoutItems($container);
      }, 50);
    }, 300);
  }

  // Gelişmiş filter_gallery (smooth animasyon ile)
  function filter_gallery_smooth() {
    var $container = jQuery("#gallery");

    // Container'ı hazırla
    $container.css({
      position: "relative",
      overflow: "hidden",
    });

    // Items'lara transition ekle
    $container.find(".item").css({
      transition: "all 0.3s ease",
      opacity: "1",
      transform: "scale(1)",
    });

    // İlk layout
    layoutItems($container);

    // Filter butonları
    jQuery("#filters a").on("click", function () {
      var $this = jQuery(this);
      if ($this.hasClass("selected")) {
        return false;
      }

      var $optionSet = $this.parents();
      $optionSet.find(".selected").removeClass("selected");
      $this.addClass("selected");

      var selector = jQuery(this).attr("data-filter");

      // Smooth filtreleme
      smoothFilter($container, selector);

      return false;
    });

    // Resize event
    $(window).on("resize", function () {
      layoutItems($container);
    });
  }

  // Gelişmiş masonry (smooth animasyon ile)
  function masonry_smooth() {
    var $container = jQuery(".row-masonry");

    // Container'ı hazırla
    $container.css({
      position: "relative",
      overflow: "hidden",
    });

    // Items'lara transition ekle
    $container.find(".item").css({
      transition: "all 0.3s ease",
      opacity: "1",
      transform: "scale(1)",
    });

    // İlk layout
    layoutItems($container);

    // Filter butonları
    jQuery("#filters a").on("click", function () {
      var $this = jQuery(this);
      if ($this.hasClass("selected")) {
        return false;
      }

      var $optionSet = $this.parents();
      $optionSet.find(".selected").removeClass("selected");
      $this.addClass("selected");

      var selector = jQuery(this).attr("data-filter");

      // Smooth filtreleme
      smoothFilter($container, selector);

      return false;
    });

    // Resize event
    $(window).on("resize", function () {
      layoutItems($container);
    });
  }

  // jQuery plugin olarak kullanım için
  $.fn.modernIsotope = function (options) {
    var settings = $.extend(
      {
        itemSelector: ".item",
        filter: "*",
        animationDuration: 300,
      },
      options
    );

    return this.each(function () {
      var $container = $(this);

      $container.css({
        position: "relative",
        overflow: "hidden",
      });

      // Items'lara transition ekle
      $container.find(settings.itemSelector).css({
        transition: "all " + settings.animationDuration + "ms ease",
        opacity: "1",
        transform: "scale(1)",
      });

      // İlk layout
      layoutItems($container);

      // Resize event
      $(window).on("resize", function () {
        layoutItems($container);
      });

      // Filter method
      $container.data("filter", function (selector) {
        if (selector === "*") {
          $container.find(settings.itemSelector).show();
        } else {
          $container.find(settings.itemSelector).hide();
          $container.find(settings.itemSelector + selector).show();
        }

        setTimeout(function () {
          layoutItems($container);
        }, 50);
      });
    });
  };

  // Kullanım örneği:
  // $('#gallery').modernIsotope({
  //   itemSelector: '.item',
  //   filter: '*'
  // });
  //
  // // Filtreleme:
  // $('#gallery').data('filter')('.category-1');
  /* --------------------------------------------------
   * plugin | fitvids
   * --------------------------------------------------*/
  /*!
   * FitVids 1.0
   *
   * Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
   * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
   * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
   *
   * Date: Thu Sept 01 18:00:00 2011 -0500
   */
  !(function (a) {
    a.fn.fitVids = function (b) {
      var c = {
          customSelector: null,
        },
        d = document.createElement("div"),
        e =
          document.getElementsByTagName("base")[0] ||
          document.getElementsByTagName("script")[0];
      return (
        (d.className = "fit-vids-style"),
        (d.innerHTML =
          "&shy;<style> .fluid-width-video-wrapper { width: 100%; position: relative; padding: 0; } .fluid-width-video-wrapper iframe, .fluid-width-video-wrapper object, .fluid-width-video-wrapper embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } </style>"),
        e.parentNode.insertBefore(d, e),
        b && a.extend(c, b),
        this.each(function () {
          var b = [
            "iframe[src*='player.vimeo.com']",
            "iframe[src*='www.youtube.com']",
            "iframe[src*='www.kickstarter.com']",
            "object",
            "embed",
          ];
          c.customSelector && b.push(c.customSelector);
          var d = a(this).find(b.join(","));
          d.each(function () {
            var b = a(this);
            if (
              !(
                ("embed" == this.tagName.toLowerCase() &&
                  b.parent("object").length) ||
                b.parent(".fluid-width-video-wrapper").length
              )
            ) {
              var c =
                  "object" == this.tagName.toLowerCase() || b.attr("height")
                    ? b.attr("height")
                    : b.height(),
                d = b.attr("width") ? b.attr("width") : b.width(),
                e = c / d;
              if (!b.attr("id")) {
                var f = "fitvid" + Math.floor(999999 * Math.random());
                b.attr("id", f);
              }
              b
                .wrap('<div class="fluid-width-video-wrapper"></div>')
                .parent(".fluid-width-video-wrapper")
                .css("padding-top", 100 * e + "%"),
                b.removeAttr("height").removeAttr("width");
            }
          });
        })
      );
    };
  })(jQuery);
  /* --------------------------------------------------
   * back to top
   * --------------------------------------------------*/
  var scrollTrigger = 500; // px
  var t = 0;

  function backToTop() {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > scrollTrigger) {
      $("#back-to-top").addClass("show");
      $("#back-to-top").removeClass("hide");
      t = 1;
    }

    if (scrollTop < scrollTrigger && t == 1) {
      $("#back-to-top").addClass("hide");
    }

    $("#back-to-top").on("click", function (e) {
      e.preventDefault();
      $("html,body").stop(true).animate(
        {
          scrollTop: 0,
        },
        700
      );
    });
  }
  /* --------------------------------------------------
   * plugin | scroll to
   * --------------------------------------------------*/
  /*!
   * jquery.scrollto.js 0.0.1 - https://github.com/yckart/jquery.scrollto.js
   * Scroll smooth to any element in your DOM.
   *
   * Copyright (c) 2012 Yannick Albert (http://yckart.com)
   * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
   * 2013/02/17
   **/
  $.scrollTo = $.fn.scrollTo = function (x, y, options) {
    if (!(this instanceof $))
      return $.fn.scrollTo.apply($("html, body"), arguments);

    options = $.extend(
      {},
      {
        gap: {
          x: 0,
          y: 0,
        },
        animation: {
          easing: "easeInOutExpo",
          duration: 600,
          complete: $.noop,
          step: $.noop,
        },
      },
      options
    );

    return this.each(function () {
      if (!jQuery("body").hasClass("side-layout")) {
        var h = 69;
      } else {
        var h = 0;
      }

      var elem = $(this);
      elem.stop().animate(
        {
          scrollLeft: !isNaN(Number(x))
            ? x
            : $(y).offset().left + options.gap.x,
          scrollTop: !isNaN(Number(y))
            ? y
            : $(y).offset().top + options.gap.y - h, // *edited
        },
        options.animation
      );
    });
  };
  /* --------------------------------------------------
   * counting number
   * --------------------------------------------------*/
  function de_counter() {
    jQuery(".timer").each(function () {
      var imagePos = jQuery(this).offset().top;
      var topOfWindow = jQuery(window).scrollTop();
      if (imagePos < topOfWindow + jQuery(window).height() && v_count == "0") {
        jQuery(function ($) {
          // start all the timers
          jQuery(".timer").each(count);

          function count(options) {
            v_count = "1";
            var $this = jQuery(this);
            options = $.extend(
              {},
              options || {},
              $this.data("countToOptions") || {}
            );
            $this.countTo(options);
          }
        });
      }
    });
  }
  /* --------------------------------------------------
   * progress bar
   * --------------------------------------------------*/

  function text_rotate() {
    var quotes = $(".text-rotate-wrap .text-item");
    var quoteIndex = -1;

    function showNextQuote() {
      ++quoteIndex;
      quotes
        .eq(quoteIndex % quotes.length)
        .fadeIn(1)
        .delay(1500)
        .fadeOut(1, showNextQuote);
    }

    showNextQuote();
  }
  /* --------------------------------------------------
   * custom background
   * --------------------------------------------------*/
  function custom_bg() {
    $("body,div,section,span,form").css("background-color", function () {
      if ($(this).is("[data-bgcolor]")) {
        jQuery(this).addClass("bgcustom");
      }
      return jQuery(this).data("bgcolor");
    });
    $("body,div,section").css("background", function () {
      if ($(this).is("[data-bgimage]")) {
        jQuery(this).addClass("bgcustom");
      }
      return jQuery(this).data("bgimage");
    });
    $("body,div,section").css("background-size", function () {
      return "100% auto";
    });

    $("body,div,section").css("background-repeat", function () {
      return "no-repeat";
    });
  }
  /* --------------------------------------------------
   * custom elements
   * --------------------------------------------------*/
  function custom_elements() {
    // --------------------------------------------------
    // tabs
    // --------------------------------------------------
    jQuery(".de_tab").find(".de_tab_content > div").hide();
    jQuery(".de_tab").find(".de_tab_content > div:first").show();
    jQuery("li").find(".v-border").fadeTo(150, 0);
    jQuery("li.active").find(".v-border").fadeTo(150, 1);
    jQuery(".de_nav li").on("click", function () {
      jQuery(this).parent().find("li").removeClass("active");
      jQuery(this).addClass("active");
      jQuery(this).parent().parent().find(".v-border").fadeTo(150, 0);
      jQuery(this).parent().parent().find(".de_tab_content > div").hide();
      var indexer = jQuery(this).index(); //gets the current index of (this) which is #nav li
      jQuery(this)
        .parent()
        .parent()
        .find(".de_tab_content > div:eq(" + indexer + ")")
        .fadeIn(); //uses whatever index the link has to open the corresponding box
      jQuery(this).find(".v-border").fadeTo(150, 1);
    });
    // request quote function
    var rq_step = 1;
    jQuery("#request_form .btn-right").on("click", function () {
      var rq_name = $("#rq_name").val();
      var rq_email = $("#rq_email").val();
      var rq_phone = $("#rq_phone").val();
      if (rq_step == 1) {
        if (rq_name.length == 0) {
          $("#rq_name").addClass("error_input");
        } else {
          $("#rq_name").removeClass("error_input");
        }
        if (rq_email.length == 0) {
          $("#rq_email").addClass("error_input");
        } else {
          $("#rq_email").removeClass("error_input");
        }
        if (rq_phone.length == 0) {
          $("#rq_phone").addClass("error_input");
        } else {
          $("#rq_phone").removeClass("error_input");
        }
      }
      if (rq_name.length != 0 && rq_email.length != 0 && rq_phone.length != 0) {
        jQuery("#rq_step_1").hide();
        jQuery("#rq_step_2").fadeIn();
      }
    });
    // --------------------------------------------------
    // tabs
    // --------------------------------------------------
    jQuery(".de_review").find(".de_tab_content > div").hide();
    jQuery(".de_review").find(".de_tab_content > div:first").show();
    //jQuery('.de_review').find('.de_nav li').fadeTo(150,.5);
    jQuery(".de_review").find(".de_nav li:first").fadeTo(150, 1);
    jQuery(".de_nav li").on("click", function () {
      jQuery(this).parent().find("li").removeClass("active");
      //jQuery(this).parent().find('li').fadeTo(150,.5);
      jQuery(this).addClass("active");
      jQuery(this).fadeTo(150, 1);
      jQuery(this).parent().parent().find(".de_tab_content > div").hide();
      var indexer = jQuery(this).index(); //gets the current index of (this) which is #nav li
      jQuery(this)
        .parent()
        .parent()
        .find(".de_tab_content > div:eq(" + indexer + ")")
        .show(); //uses whatever index the link has to open the corresponding box
    });
    // --------------------------------------------------
    // toggle
    // --------------------------------------------------
    jQuery(".toggle-list h2").addClass("acc_active");
    jQuery(".toggle-list h2").toggle(
      function () {
        jQuery(this).addClass("acc_noactive");
        jQuery(this).next(".ac-content").slideToggle(200);
      },
      function () {
        jQuery(this).removeClass("acc_noactive").addClass("acc_active");
        jQuery(this).next(".ac-content").slideToggle(200);
      }
    );
    // --------------------------------------------------
    // toggle
    // --------------------------------------------------
    jQuery(".expand-custom .toggle").click(function () {
      jQuery(this).stop().toggleClass("clicked");
      jQuery(this)
        .stop()
        .parent()
        .parent()
        .parent()
        .find(".details")
        .slideToggle(500);
    });
  }
  /* --------------------------------------------------
   * video autosize
   * --------------------------------------------------*/
  function video_autosize() {
    jQuery(".de-video-container").each(function () {
      var height_1 = jQuery(this).css("height");
      var height_2 = jQuery(this).find(".de-video-content").css("height");
      var newheight =
        (height_1.substring(0, height_1.length - 2) -
          height_2.substring(0, height_2.length - 2)) /
        2;
      jQuery(this).find(".de-video-overlay").css("height", height_1);
      jQuery(this).find(".de-video-content").animate(
        {
          "margin-top": newheight,
        },
        "fast"
      );
    });
  }
  /* --------------------------------------------------
   * center x and y
   * --------------------------------------------------*/
  function center_xy() {
    jQuery(".center-xy").each(function () {
      jQuery(this)
        .parent()
        .find("img")
        .on("load", function () {
          var w = parseInt(
            jQuery(this).parent().find(".center-xy").css("width"),
            10
          );
          var h = parseInt(
            jQuery(this).parent().find(".center-xy").css("height"),
            10
          );
          var pic_w = jQuery(this).css("width");
          var pic_h = jQuery(this).css("height");
          var tp = jQuery(this).parent();
          tp.find(".center-xy").css("left", parseInt(pic_w, 10) / 2 - w / 2);
          tp.find(".center-xy").css("top", parseInt(pic_h, 10) / 2 - h / 2);
          tp.find(".bg-overlay").css("width", pic_w);
          tp.find(".bg-overlay").css("height", pic_h);
        })
        .each(function () {
          if (this.complete) $(this).load();
        });
    });
  }
  /* --------------------------------------------------
   * add arrow for mobile menu
   * --------------------------------------------------*/
  function menu_arrow() {
    // mainmenu create span
    jQuery("#mainmenu li a").each(function () {
      if ($(this).next("ul").length > 0) {
        $("<span></span>").insertAfter($(this));
      }
    });
    // mainmenu arrow click
    jQuery("#mainmenu > li > span").on("click", function () {
      var iteration = $(this).data("iteration") || 1;
      switch (iteration) {
        case 1:
          $(this).addClass("active");
          $(this).parent().find("ul:first").css("height", "auto");
          var curHeight = $(this).parent().find("ul:first").height();
          $(this).parent().find("ul:first").css("height", "0");
          $(this).parent().find("ul:first").animate(
            {
              height: curHeight,
            },
            300,
            "easeOutQuint"
          );
          break;
        case 2:
          var curHeight = $(this).parent().find("ul:first").height();
          $(this).removeClass("active");
          $(this).parent().find("ul:first").animate(
            {
              height: "0",
            },
            300,
            "easeOutQuint"
          );
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });
    jQuery("#mainmenu > li > ul > li > span").on("click", function () {
      var iteration = $(this).data("iteration") || 1;
      switch (iteration) {
        case 1:
          $(this).addClass("active");
          $(this).parent().find("ul:first").css("height", "auto");
          $(this)
            .parent()
            .parent()
            .parent()
            .find("ul:first")
            .css("height", "auto");
          var curHeight = $(this).parent().find("ul:first").height();
          $(this).parent().find("ul:first").css("height", "0");
          $(this).parent().find("ul:first").animate(
            {
              height: curHeight,
            },
            400,
            "easeInOutQuint"
          );
          break;
        case 2:
          $(this).removeClass("active");
          $(this).parent().find("ul:first").animate(
            {
              height: "0",
            },
            400,
            "easeInOutQuint"
          );
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });

    jQuery(".de-country .d-title").on("click", function () {
      var iteration = $(this).data("iteration") || 1;

      switch (iteration) {
        case 1:
          jQuery(this).parent().addClass("expand");
          break;
        case 2:
          jQuery(this).parent().removeClass("expand");
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });

    jQuery("#de-click-menu-profile").on("click", function () {
      var iteration = $(this).data("iteration") || 1;

      switch (iteration) {
        case 1:
          $("#de-submenu-profile").show();
          $("#de-submenu-profile").addClass("open");
          $("#de-submenu-notification").removeClass("open");
          $("#de-submenu-notification").hide();
          $("#de-click-menu-notification").data("iteration", 1);
          break;
        case 2:
          $("#de-submenu-profile").removeClass("open");
          $("#de-submenu-profile").hide();
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });

    jQuery("#de-click-menu-notification").on("click", function () {
      var iteration = $(this).data("iteration") || 1;

      switch (iteration) {
        case 1:
          $("#de-submenu-notification").show();
          $("#de-submenu-notification").addClass("open");
          $("#de-submenu-profile").removeClass("open");
          $("#de-submenu-profile").hide();
          $("#de-click-menu-profile").data("iteration", 1);
          break;
        case 2:
          $("#de-submenu-notification").removeClass("open");
          $("#de-submenu-notification").hide();
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });
  }
  /* --------------------------------------------------
   * show gallery item sequence
   * --------------------------------------------------*/
  function sequence() {
    var sq = jQuery(".sequence > .gallery-item .picframe");
    var count = sq.length;
    sq.addClass("fadeIn");
    sq.find("img").addClass("slideInUp");
    for (var i = 0; i <= count; i++) {
      var sqx = jQuery(".sequence > .gallery-item:eq(" + i + ") .picframe");
      sqx.attr("data-wow-delay", i / 8 + "s");
      sqx.find("img").attr("data-wow-delay", i / 16 + "s");
    }
  }
  /* --------------------------------------------------
   * show gallery item sequence
   * --------------------------------------------------*/
  function sequence_a() {
    var sq = jQuery(".sequence").find(".sq-item");
    var count = sq.length;
    sq.addClass("fadeInUp");
    for (var i = 0; i <= count; i++) {
      var sqx = jQuery(".sequence").find(".sq-item:eq(" + i + ")");
      sqx.attr("data-wow-delay", i / 8 + "s");
      sqx.attr("data-wow-speed", "1s");
    }
  }
  /* --------------------------------------------------
   * custom scroll
   * --------------------------------------------------*/
  $.fn.moveIt = function () {
    $(this).each(function () {
      instances.push(new moveItItem($(this)));
    });
  };

  function moveItItemNow() {
    var scrollTop = $window.scrollTop();
    instances.forEach(function (inst) {
      inst.update(scrollTop);
    });
  }

  function moveItItem(el) {
    this.el = $(el);
    this.speed = parseInt(this.el.attr("data-scroll-speed"));
  }
  moveItItem.prototype.update = function (scrollTop) {
    var pos = scrollTop / this.speed;
    this.el.css("transform", "translateY(" + pos + "px)");
  };
  $(function () {
    $("[data-scroll-speed]").moveIt();
  });
  /* --------------------------------------------------
   * multiple function
   * --------------------------------------------------*/
  function init() {
    var sh = jQuery("#de-sidebar").css("height");
    var dh = jQuery(window).innerHeight();
    var h = parseInt(sh) - parseInt(dh);

    function scrolling() {
      var mq = window.matchMedia("(min-width: 993px)");
      var ms = window.matchMedia("(min-width: 768px)");
      if (mq.matches) {
        var distanceY =
            window.pageYOffset || document.documentElement.scrollTop,
          shrinkOn = 0,
          header = jQuery("header");
        if (distanceY > shrinkOn) {
          header.addClass("smaller");
        } else {
          if (header.hasClass("smaller")) {
            header.removeClass("smaller");
          }
        }
      }
      if (mq.matches) {
        if (jQuery("header").hasClass("side-header")) {
          if (jQuery(document).scrollTop() >= h) {
            jQuery("#de-sidebar").css("position", "fixed");
            if (parseInt(sh) > parseInt(dh)) {
              jQuery("#de-sidebar").css("top", -h);
            }
            jQuery("#main").addClass("col-md-offset-3");
            jQuery("h1#logo img").css("padding-left", "7px");
            jQuery("header .h-content").css("padding-left", "7px");
            jQuery("#mainmenu li").css("width", "103%");
          } else {
            jQuery("#de-sidebar").css("position", "relative");
            if (parseInt(sh) > parseInt(dh)) {
              jQuery("#de-sidebar").css("top", 0);
            }
            jQuery("#main").removeClass("col-md-offset-3");
            jQuery("h1#logo img").css("padding-left", "0px");
            jQuery("header .h-content").css("padding-left", "0px");
            jQuery("#mainmenu li").css("width", "100%");
          }
        }
      }
    }

    // --------------------------------------------------
    // looping background
    // --------------------------------------------------

    scrolling();

    jQuery(".activity-filter > li").on("click", function () {
      var iteration = $(this).data("iteration") || 1;
      switch (iteration) {
        case 1:
          jQuery(".activity-list > li").hide();
          if (jQuery(this).hasClass("filter_by_followings")) {
            jQuery("li.act_follow").show();
          } else if (jQuery(this).hasClass("filter_by_sales")) {
            jQuery("li.act_sale").show();
          } else if (jQuery(this).hasClass("filter_by_offers")) {
            jQuery("li.act_offer").show();
          } else if (jQuery(this).hasClass("filter_by_likes")) {
            jQuery("li.act_like").show();
          }
          jQuery(".activity-filter > li").removeClass("active");
          jQuery(this).addClass("active");
          break;
        case 2:
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });

    jQuery(".filter__r").on("click", function () {
      jQuery(".activity-filter > li").removeClass("active");
      jQuery(".activity-list > li").show();
    });

    jQuery(".btn-close").on("click", function () {
      var iteration = $(this).data("iteration") || 1;
      switch (iteration) {
        case 1:
          jQuery("#popup-box").addClass("popup-hide");
          jQuery("#popup-box").removeClass("popup-show");
          break;
        case 2:
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });
  }
  // init_de begin //
  function init_de() {
    jQuery(".de-team-list").each(function () {
      jQuery(this)
        .find("img")
        .on("load", function () {
          var w = jQuery(this).css("width");
          var h = jQuery(this).css("height");
          var tpp = jQuery(this).parent().parent();
          tpp.find(".team-pic").css("height", h);
          tpp.find(".team-desc").css("width", w);
          tpp.find(".team-desc").css("height", h);
          tpp.find(".team-desc").css("top", h);
        })
        .each(function () {
          if (this.complete) $(this).load();
        });
    });
    jQuery(".de-team-list")
      .on("mouseenter", function () {
        var h;
        h = jQuery(this).find("img").css("height");
        jQuery(this).find(".team-desc").stop(true).animate(
          {
            top: "0px",
          },
          350,
          "easeOutQuad"
        );
        jQuery(this).find("img").stop(true).animate(
          {
            "margin-top": "-100px",
          },
          400,
          "easeOutQuad"
        );
      })
      .on("mouseleave", function () {
        var h;
        h = jQuery(this).find("img").css("height");
        jQuery(this).find(".team-desc").stop(true).animate(
          {
            top: h,
          },
          350,
          "easeOutQuad"
        );
        jQuery(this).find("img").stop(true).animate(
          {
            "margin-top": "0px",
          },
          400,
          "easeOutQuad"
        );
      });
    // portfolio
    jQuery(".item .picframe").each(function () {
      var img = jQuery(this).find("img");
      img.css("width", "100%");
      img.css("height", "auto");
      img
        .on("load", function () {
          var w = jQuery(this).css("width");
          var h = jQuery(this).css("height");
          //nh = (h.substring(0, h.length - 2)/2)-48;
          jQuery(this).parent().css("height", h);
        })
        .each(function () {
          if (this.complete) $(this).load();
        });
    });
    // --------------------------------------------------
    // portfolio hover
    // --------------------------------------------------
    jQuery(".overlay").fadeTo(1, 0);
    // gallery hover
    jQuery(".item .picframe")
      .on("mouseenter", function () {
        var ov = jQuery(this).parent().find(".overlay");
        ov.width(jQuery(this).find("img").css("width"));
        ov.height(jQuery(this).find("img").css("height"));
        ov.stop(true).fadeTo(200, 1);
        var picheight = jQuery(this).find("img").css("height");
        var newheight;
        newheight = picheight.substring(0, picheight.length - 2) / 2 - 10;
        //alert(newheight);
        //jQuery(this).parent().find(".pf_text").stop(true).animate({'margin-top': newheight},200,'easeOutCubic');
        jQuery(this).parent().find(".pf_text").css("margin-top", newheight);
        jQuery(this).parent().find(".pf_text").stop(true).animate(
          {
            opacity: "1",
          },
          1000,
          "easeOutCubic"
        );
        var w = jQuery(this).find("img").css("width");
        var h = jQuery(this).find("img").css("height");
        var w = parseInt(w, 10);
        var h = parseInt(h, 10);
        var $scale = 1;
        //alert(w);
        jQuery(this)
          .find("img")
          .stop(true)
          .animate(
            {
              width: w * $scale,
              height: h * $scale,
              "margin-left": (-w * ($scale - 1)) / 2,
              "margin-top": (-h * ($scale - 1)) / 2,
            },
            400,
            "easeOutCubic"
          );
      })
      .on("mouseleave", function () {
        var newheight;
        var picheight = jQuery(this).find("img").css("height");
        newheight = picheight.substring(0, picheight.length - 2) / 2 - 10;
        //jQuery(this).parent().find(".pf_text").stop(true).animate({'margin-top': newheight - 30},200,'easeOutCubic');
        jQuery(this).parent().find(".pf_text").stop(true).animate(
          {
            opacity: "0",
          },
          400,
          "easeOutCubic"
        );
        jQuery(this).parent().find(".overlay").stop(true).fadeTo(200, 0);
        jQuery(this).find("img").stop(true).animate(
          {
            width: "100%",
            height: "100%",
            "margin-left": 0,
            "margin-top": 0,
          },
          400,
          "easeOutQuad"
        );
      });
    jQuery(".overlay").fadeTo(1, 0);

    jQuery(".grid.border").css("padding-top", grid_size);
    jQuery(".grid.border").css("padding-left", grid_size);

    jQuery("#selector .opt.tc1").addClass("active");

    jQuery("#selector .opt").on("click", function () {
      jQuery("#selector .opt").removeClass("active");
      var color = jQuery(this).data("color");
      jQuery("#colors").attr("href", "css/colors/" + color + ".css");
      jQuery(this).addClass("active");
    });
  }
  // de_init end //

  // rtl begin //
  if (rtl_mode == "on") {
    jQuery("body").addClass("rtl");
    jQuery("#bootstrap").attr("href", "css/bootstrap.rtl.min.css");
    jQuery("#bootstrap-grid").attr("href", "css/bootstrap-grid.rtl.min.css");
    jQuery("#bootstrap-reboot").attr(
      "href",
      "css/bootstrap-reboot.rtl.min.css"
    );
    jQuery("#mdb").attr("href", "css/mdb.rtl.min.css");
    jQuery("html").attr("dir", "rtl");
  }
  // rtl end //

  if (preloader == "off") {
    jQuery("#de-preloader").hide();
  }

  function f_rtl() {
    jQuery("#selector #demo-rtl").on("click", function () {
      var iteration = $(this).data("iteration") || 1;
      switch (iteration) {
        case 1:
          jQuery("body").addClass("rtl");
          jQuery("#bootstrap").attr("href", "css/bootstrap.rtl.min.css");
          jQuery("#bootstrap-grid").attr(
            "href",
            "css/bootstrap-grid.rtl.min.css"
          );
          jQuery("#bootstrap-reboot").attr(
            "href",
            "css/bootstrap-reboot.rtl.min.css"
          );
          jQuery("#mdb").attr("href", "css/mdb.rtl.min.css");
          jQuery("html").attr("dir", "rtl");
          jQuery(this).find(".sc-val").text("Click to Disable");
          break;
        case 2:
          jQuery("body").removeClass("rtl");
          jQuery("#bootstrap").attr("href", "css/bootstrap.min.css");
          jQuery("#bootstrap-grid").attr("href", "css/bootstrap-grid.min.css");
          jQuery("#bootstrap-reboot").attr(
            "href",
            "css/bootstrap-reboot.min.css"
          );
          jQuery("#mdb").attr("href", "css/mdb.min.css");
          jQuery("html").attr("dir", "ltr");
          jQuery(this).find(".sc-val").text("Click to Enable");
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });
  }

  jQuery("#dark-mode").on("click", function () {
    if (jQuery("body").hasClass("dark-scheme")) {
      window.location.href =
        "https://www.designesia.com/themes/gospace/index.html";
    } else {
      window.location.href =
        "https://www.designesia.com/themes/gospace/02_dark-index.html";
    }
  });

  function grid_gallery() {
    jQuery(".grid-item").each(function () {
      var this_col = Number(jQuery(this).parent().attr("data-col"));
      var this_gridspace = Number(jQuery(this).parent().attr("data-gridspace"));
      var this_ratio = eval($(this).parent().attr("data-ratio"));
      jQuery(this).parent().css("padding-left", this_gridspace);
      var w =
        ($(document).width() - (this_gridspace * this_col + 1)) / this_col -
        this_gridspace / this_col;
      var gi = $(this);
      var h = w * this_ratio;
      gi.css("width", w);
      gi.css("height", h);
      gi.find(".pf_title").css("margin-top", h / 2 - 10);
      gi.css("margin-right", this_gridspace);
      gi.css("margin-bottom", this_gridspace);
      $(this).parent().css("padding-top", this_gridspace);
      if (gi.hasClass("large")) {
        $(this).css("width", w * 2 + this_gridspace);
        $(this).css("height", h * 2 + this_gridspace);
      }
      if (gi.hasClass("large-width")) {
        $(this).css("width", w * 2 + this_gridspace);
        $(this).css("height", h);
      }
      if (gi.hasClass("large-height")) {
        $(this).css("height", h * 2 + this_gridspace);
        gi.find(".pf_title").css("margin-top", h - 20);
      }
    });
  }

  /* --------------------------------------------------
   * center-y
   * --------------------------------------------------*/
  function centerY() {
    jQuery(".full-height").each(function () {
      var dh = jQuery(window).innerHeight();
      jQuery(this).css("min-height", dh);
    });
  }

  /* --------------------------------------------------
   * progress bar
   * --------------------------------------------------*/
  function de_progress() {
    jQuery(".de-progress").each(function () {
      var pos_y = jQuery(this).offset().top;
      var value = jQuery(this).find(".progress-bar").attr("data-value");
      var topOfWindow = jQuery(window).scrollTop();
      if (pos_y < topOfWindow + 550) {
        jQuery(this).find(".progress-bar").css(
          {
            width: value,
          },
          "slow"
        );
      }

      jQuery(this)
        .find(".value")
        .text(jQuery(this).find(".progress-bar").attr("data-value"));
    });
  }

  function de_countdown() {
    $(".de_countdown").each(function () {
      var y = $(this).data("year");
      var m = $(this).data("month");
      var d = $(this).data("day");
      var h = $(this).data("hour");
      $(this).countdown({ until: new Date(y, m - 1, d, h) });
    });
  }

  // --------------------------------------------------
  // preloader
  // --------------------------------------------------

  function copyText(element) {
    var $copyText = jQuery(element).text();
    var button = jQuery("#btn_copy");
    navigator.clipboard.writeText($copyText).then(
      function () {
        var originalText = button.text();
        button.html("Copied!");
        button.addClass("clicked");
        setTimeout(function () {
          button.html(originalText);
          button.removeClass("clicked");
        }, 750);
      },
      function () {
        button.html("Error");
      }
    );
  }

  // --------------------------------------------------
  // custom dropdown
  // --------------------------------------------------
  function dropdown(e) {
    var obj = $(e + ".dropdown");
    var btn = obj.find(".btn-selector");
    var dd = obj.find("ul");
    var opt = dd.find("li");

    obj
      .on("mouseenter", function () {
        dd.show();
      })
      .on("mouseleave", function () {
        dd.hide();
      });

    opt.on("click", function () {
      dd.hide();
      var txt = $(this).text();
      opt.removeClass("active");
      $(this).addClass("active");
      btn.text(txt);
    });
  }

  function de_sidebar() {
    enquire.register("screen and (min-width: 993px)", {
      match: function () {
        if ($(".sidebar_inner").length) {
          $(".sidebar_inner").sticky({
            top: 130,
            bottom: 20,
            stopOn: "footer",
            disableOn: 993,
          });
        }

        if ($("#search_location").length) {
          $("#search_location").sticky({
            top: 130,
            bottom: 20,
            stopOn: "footer",
            disableOn: 993,
          });
        }
      },
    });
  }

  function de_share() {
    var url = window.location.href;
    $(".fa-twitter").on("click", function () {
      window.open("https://twitter.com/share?url=" + url, "_blank");
    });
    $(".fa-facebook").on("click", function () {
      window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" + url,
        "_blank"
      );
    });
    $(".fa-reddit").on("click", function () {
      window.open("http://www.reddit.com/submit?url=" + url, "_blank");
    });
    $(".fa-linkedin").on("click", function () {
      window.open(
        "https://www.linkedin.com/shareArticle?mini=true&url=" + url,
        "_blank"
      );
    });
    $(".fa-pinterest").on("click", function () {
      window.open(
        "https://www.pinterest.com/pin/create/button/?url=" + url,
        "_blank"
      );
    });
    $(".fa-stumbleupon").on("click", function () {
      window.open("http://www.stumbleupon.com/submit?url=" + url, "_blank");
    });
    $(".fa-delicious").on("click", function () {
      window.open(
        "https://delicious.com/save?v=5&noui&jump=close&url=" + url,
        "_blank"
      );
    });
    $(".fa-envelope").on("click", function () {
      window.open("mailto:?subject=Share With Friends&body=" + url, "_blank");
    });
  }

  /* --------------------------------------------------
   * document ready
   * --------------------------------------------------*/
  jQuery(document).ready(function () {
    "use strict";
    f_rtl();
    load_magnificPopup();
    center_xy();
    init_de();
    grid_gallery();
    init_resize();
    de_progress();
    de_countdown();
    dropdown("#select_lang");
    dropdown("#select_hour_format");
    de_sidebar();
    de_share();
    $(".jarallax").jarallax();

    $(function () {
      $(".lazy").lazy();
    });

    function formatState(state) {
      if (!state.id) {
        return state.text;
      }
      var $state = $(
        '<span><img src="' +
          $(state.element).attr("data-src") +
          '" class="img-flag" /> ' +
          state.text +
          "</span>"
      );
      return $state;
    }
    $("#vehicle_type").select2({
      minimumResultsForSearch: Infinity,
      templateResult: formatState,
      templateSelection: formatState,
      width: "100%",
    });

    $(".server_location").select2({
      minimumResultsForSearch: Infinity,
      templateResult: formatState,
      templateSelection: formatState,
      width: "100%",
    });

    /* detepicker */

    $("#date-picker").daterangepicker({
      singleDatePicker: true,
      showISOWeekNumbers: true,
      timePicker: false,
      autoUpdateInput: true,
      locale: {
        format: "MMMM DD, YYYY",
        separator: " - ",
        applyLabel: "Apply",
        cancelLabel: "Cancel",
        fromLabel: "From",
        toLabel: "To",
        customRangeLabel: "Custom",
        weekLabel: "W",
        daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        firstDay: 1,
      },
      linkedCalendars: true,
      showCustomRangeLabel: false,
      startDate: 1,
      endDate: moment().startOf("hour").add(24, "hour"),
      opens: "right",
    });

    $("#date-picker-2").daterangepicker({
      singleDatePicker: true,
      showISOWeekNumbers: true,
      timePicker: false,
      autoUpdateInput: true,
      locale: {
        format: "MMMM DD, YYYY",
        separator: " - ",
        applyLabel: "Apply",
        cancelLabel: "Cancel",
        fromLabel: "From",
        toLabel: "To",
        customRangeLabel: "Custom",
        weekLabel: "W",
        daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        firstDay: 1,
      },
      linkedCalendars: true,
      showCustomRangeLabel: false,
      startDate: 1,
      endDate: moment().startOf("hour").add(24, "hour"),
      opens: "right",
    });

    // switch

    $(".opt-2").css("display", "none");

    $("#sw-1").click(function () {
      if ($(this).is(":checked")) {
        $(".opt-1").css("display", "none");
        $(".opt-2").css("display", "inline-block");
      } else {
        $(".opt-2").css("display", "none");
        $(".opt-1").css("display", "inline-block");
      }
    });

    // --------------------------------------------------
    // custom positiion
    // --------------------------------------------------
    var $doc_height = jQuery(window).innerHeight();
    jQuery("#homepage #content.content-overlay").css("margin-top", $doc_height);
    //jQuery('.full-height').css("height", $doc_height);
    //var picheight = jQuery('.center-y').css("height");
    //picheight = parseInt(picheight, 10);
    //jQuery('.center-y').css('margin-top', (($doc_height - picheight) / 2)-100);
    jQuery(".full-height .de-video-container").css("min-height", $doc_height);

    if (jQuery("header").hasClass("autoshow")) {
      $op_header_autoshow = 1;
    }

    jQuery("#btn_copy").on("click", function () {
      copyText("#wallet");
    });

    $("#mainmenu > li:has(ul)").addClass("menu-item-has-children");

    $(".d-item").slice(0, 8).show();
    $("#loadmore").on("click", function (e) {
      e.preventDefault();
      $(".d-item:hidden").slice(0, 4).slideDown();
      if ($(".d-item:hidden").length == 0) {
        //$("#loadmore").text("No Content").addClass("noContent");
        $("#loadmore").hide();
      }
    });

    centerY();

    $("#mainmenu li:has(ul)").addClass("has-child");

    // bootstrap
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    var popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });

    // close bootstrap

    // --------------------------------------------------
    // blog list hover
    // --------------------------------------------------
    jQuery(".blog-list")
      .on("mouseenter", function () {
        var v_height = jQuery(this).find(".blog-slide").css("height");
        var v_width = jQuery(this).find(".blog-slide").css("width");
        var newheight = v_height.substring(0, v_height.length - 2) / 2 - 40;
        var owa = jQuery(this).find(".owl-arrow");
        owa.css("margin-top", newheight);
        owa.css("width", v_width);
        owa.fadeTo(150, 1);
        //alert(v_height);
      })
      .on("mouseleave", function () {
        jQuery(this).find(".owl-arrow").fadeTo(150, 0);
      });
    // --------------------------------------------------
    // navigation for mobile
    // --------------------------------------------------
    jQuery("#menu-btn").on("click", function () {
      var h = jQuery("header")[0].scrollHeight;

      if (mobile_menu_show == 0) {
        jQuery("header").addClass("menu-open");
        jQuery("header").css("height", $(window).innerHeight());
        mobile_menu_show = 1;
      } else {
        jQuery("header").removeClass("menu-open");
        jQuery("header").css("height", "auto");
        mobile_menu_show = 0;
      }
    });
    jQuery("a.btn").on("click", function (evn) {
      if (this.href.indexOf("#") != -1) {
        evn.preventDefault();
        jQuery("html,body").scrollTo(this.hash, this.hash);
      }
    });
    jQuery(".de-gallery .item .icon-info").on("click", function () {
      jQuery(".page-overlay").show();
      url = jQuery(this).attr("data-value");
      jQuery("#loader-area .project-load").load(url, function () {
        jQuery("#loader-area").slideDown(500, function () {
          jQuery(".page-overlay").hide();
          jQuery("html, body").animate(
            {
              scrollTop: jQuery("#loader-area").offset().top - 70,
            },
            500,
            "easeOutCubic"
          );
          //
          jQuery(".image-slider").owlCarousel({
            items: 1,
            singleItem: true,
            navigation: false,
            pagination: true,
            autoPlay: false,
          });
          jQuery(".container").fitVids();
          jQuery("#btn-close-x").on("click", function () {
            jQuery("#loader-area").slideUp(500, function () {
              jQuery("html, body").animate(
                {
                  scrollTop: jQuery("#section-portfolio").offset().top - 70,
                },
                500,
                "easeOutCirc"
              );
            });
            return false;
          });
        });
      });
    });
    jQuery(".de-gallery .item").on("click", function () {
      $("#navigation").show();
    });
    // btn arrow up
    jQuery(".arrow-up").on("click", function () {
      jQuery(".coming-soon .coming-soon-content").fadeOut(
        "medium",
        function () {
          jQuery("#hide-content").fadeIn(600, function () {
            jQuery(".arrow-up").animate(
              {
                bottom: "-40px",
              },
              "slow"
            );
            jQuery(".arrow-down").animate(
              {
                top: "0",
              },
              "slow"
            );
          });
        }
      );
    });
    // btn arrow down
    jQuery(".arrow-down").on("click", function () {
      jQuery("#hide-content").fadeOut("slow", function () {
        jQuery(".coming-soon .coming-soon-content").fadeIn(800, function () {
          jQuery(".arrow-up").animate(
            {
              bottom: "0px",
            },
            "slow"
          );
          jQuery(".arrow-down").animate(
            {
              top: "-40",
            },
            "slow"
          );
        });
      });
    });

    jQuery(".d-item_like").on("click", function () {
      var iteration = $(this).data("iteration") || 1;

      switch (iteration) {
        case 1:
          $(this).find("i").addClass("active");
          var val = parseInt($(this).find("span").text()) + 1;
          $(this).find("span").text(val);
          break;
        case 2:
          $(this).find("i").removeClass("active");
          var val = parseInt($(this).find("span").text()) - 1;
          $(this).find("span").text(val);
          break;
      }
      iteration++;
      if (iteration > 2) iteration = 1;
      $(this).data("iteration", iteration);
    });

    /* --------------------------------------------------
          after window load
          * --------------------------------------------------*/

    setTimeout(function () {
      $("#cookieConsent").fadeIn(400);
    }, 2000);
    $("#closeCookieConsent, .cookieConsentOK").click(function () {
      $("#cookieConsent").fadeOut(400);
    });

    $(".switch-with-title .checkbox").change(function () {
      if (this.checked) {
        jQuery(this).parent().parent().find(".hide-content").show();
      } else {
        jQuery(this).parent().parent().find(".hide-content").hide();
      }
    });

    video_autosize();
    filter_gallery();
    masonry();
    custom_bg();
    menu_arrow();
    load_owl();
    custom_elements();
    init();

    new WOW().init();

    // one page navigation
    /**
     * This part causes smooth scrolling using scrollto.js
     * We target all a tags inside the nav, and apply the scrollto.js to it.
     */
    $("#homepage nav a, .scroll-to").on("click", function (evn) {
      if (this.href.indexOf("#") != -1) {
        evn.preventDefault();
        jQuery("html,body").scrollTo(this.hash, this.hash);
      }
    });
    sequence();
    sequence_a();

    $(".accordion-section-title").click(function (e) {
      var currentAttrvalue = $(this).data("tab");
      if ($(e.target).is(".active")) {
        $(this).removeClass("active");
        $(".accordion-section-content:visible").slideUp(300);
      } else {
        $(".accordion-section-title")
          .removeClass("active")
          .filter(this)
          .addClass("active");
        $(".accordion-section-content")
          .slideUp(300)
          .filter(currentAttrvalue)
          .slideDown(300);
      }
    });

    $("#get_file,#get_file_2").click(function () {
      $("#upload_file").click();
    });

    $("#upload_file").change(function () {
      var file = $(this).val();
      var filename = file.replace(/^.*\\/, "");
      $("#file_name").text(filename);
    });

    jQuery.each(jQuery("textarea[data-autoresize]"), function () {
      var offset = this.offsetHeight - this.clientHeight;

      var resizeTextarea = function (el) {
        jQuery(el)
          .css("height", "auto")
          .css("height", el.scrollHeight + offset);
      };
      jQuery(this)
        .on("keyup input", function () {
          resizeTextarea(this);
        })
        .removeAttr("data-autoresize");
    });

    /* --------------------------------------------------
     * window | on resize
     * --------------------------------------------------*/
    $(window).resize(function () {
      init_resize();
      centerY();
      grid_gallery();
      $("#vehicle_type").hide();
    });

    /* --------------------------------------------------
     * window | on scroll
     * --------------------------------------------------*/
    jQuery(window).on("scroll", function () {
      /* functions */
      header_sticky();
      de_counter();
      de_progress();
      init();
      backToTop();
      moveItItemNow();

      /* scroll zoom */
      var scroll = $(window).scrollTop();
      $(".scroll-zoom").css({
        backgroundSize: 100 + scroll / 15 + "%",
        top: -(scroll / 10) + "%",
      });

      /* fade base scroll position */
      var target = $(".fadeScroll");
      var targetHeight = target.outerHeight();
      var scrollPercent = (targetHeight - window.scrollY) / targetHeight;
      if (scrollPercent >= 0) {
        target.css("opacity", scrollPercent);
      } else {
        target.css("opacity", 0);
      }
      /* custom page with background on side
             jQuery('.side-bg').each(function() {
                 jQuery(this).find(".image-container").css("height", jQuery(this).find(".image-container").parent().css("height"));
             }); */
      /* go to anchor */
      jQuery("#mainmenu li a").each(function () {
        var cur = jQuery(this);
        if (this.href.indexOf("#") != -1) {
          var href = jQuery(this).attr("href");
          if (location.hash !== "") {
            if (jQuery(window).scrollTop() > jQuery(href).offset().top - 140) {
              clearTimeout($.data(this, "scrollCheck"));
              $.data(
                this,
                "scrollCheck",
                setTimeout(function () {
                  jQuery("#mainmenu li a").removeClass("active");
                  cur.addClass("active");
                }, 250)
              );
            }
          }
        }
      });

      // acc
      $(".toggle").click(function (e) {
        e.preventDefault();

        var $this = $(this);

        if ($this.next().hasClass("show")) {
          $this.next().removeClass("show");
          $this.next().slideUp(350);
        } else {
          $this.parent().parent().find("li .inner").removeClass("show");
          $this.parent().parent().find("li .inner").slideUp(350);
          $this.next().toggleClass("show");
          $this.next().slideToggle(350);
        }
      });
    });
    $(function () {
      "use strict";
      var x = 0;
      setInterval(function () {
        x -= 1;
        $(".bg-loop").css("background-position", x + "px 0");
      }, 50);
    });

    // price range slider

    const rangeInput = document.querySelectorAll(".range-input input"),
      priceInput = document.querySelectorAll(".price-input input"),
      range = document.querySelector(".slider .progress");
    let priceGap = 0;

    priceInput.forEach((input) => {
      input.addEventListener("input", (e) => {
        let minPrice = parseInt(priceInput[0].value),
          maxPrice = parseInt(priceInput[1].value);

        if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
          if (e.target.className === "input-min") {
            rangeInput[0].value = minPrice;
            range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
          } else {
            rangeInput[1].value = maxPrice;
            range.style.right =
              100 - (maxPrice / rangeInput[1].max) * 100 + "%";
          }
        }
      });
    });

    rangeInput.forEach((input) => {
      input.addEventListener("input", (e) => {
        let minVal = parseInt(rangeInput[0].value),
          maxVal = parseInt(rangeInput[1].value);

        if (maxVal - minVal < priceGap) {
          if (e.target.className === "range-min") {
            rangeInput[0].value = maxVal - priceGap;
          } else {
            rangeInput[1].value = minVal + priceGap;
          }
        } else {
          priceInput[0].value = minVal;
          priceInput[1].value = maxVal;
          if ($("body").hasClass("rtl")) {
            range.style.right = (minVal / rangeInput[0].max) * 100 + "%";
            range.style.left = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
          } else {
            range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
          }
        }
      });
    });
  });

  // scroll magic begin
  var new_scroll_position = 0;
  var last_scroll_position;
  var header = $("header");

  jQuery(window).on("scroll", function () {
    last_scroll_position = window.scrollY;

    // Scrolling down
    if (
      new_scroll_position < last_scroll_position &&
      last_scroll_position > 80
    ) {
      // header.removeClass('slideDown').addClass('nav-up');
      header.addClass("scroll-down");
      header.removeClass("nav-up");

      // Scrolling up
    } else if (new_scroll_position > last_scroll_position) {
      // header.removeClass('nav-up').addClass('slideDown');
      header.removeClass("scroll-down");
      header.addClass("nav-up");
    }

    new_scroll_position = last_scroll_position;
  });
  // scroll magic end

  $(window).on("load", function () {
    jQuery("#de-preloader").fadeOut(500);
    filter_gallery();
    load_owl();
    window.dispatchEvent(new Event("resize"));

    $(".grid").isotope({
      itemSelector: ".grid-item",
    });
    grid_gallery();
  });
})(jQuery);
