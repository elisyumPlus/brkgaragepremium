      const year = document.getElementById("year");
      if (year) year.textContent = new Date().getFullYear();
      const consentStorageKey = "brk-cookie-consent-v1";
      const consentLifetime = 180 * 24 * 60 * 60 * 1000;
      const readConsent = function () {
        try {
          const saved = JSON.parse(window.localStorage.getItem(consentStorageKey) || "null");
          if (!saved || !saved.expiresAt || saved.expiresAt < Date.now()) {
            window.localStorage.removeItem(consentStorageKey);
            return null;
          }
          return saved;
        } catch (error) {
          return null;
        }
      };
      let cookieConsent = readConsent();
      const applyOptionalEmbeds = function (choice) {
        if (!choice) return;
        if (choice.googleMaps) {
          document.querySelectorAll("[data-optional-map]").forEach(function (frame) {
            if (!frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.consentSrc);
            frame.hidden = false;
            const placeholder = frame.parentElement.querySelector("[data-map-placeholder]");
            if (placeholder) placeholder.hidden = true;
          });
        }
        if (choice.instagram) {
          const posts = document.querySelectorAll("[data-optional-instagram]");
          posts.forEach(function (post) {
            post.hidden = false;
            const placeholder = post.parentElement.querySelector("[data-instagram-placeholder]");
            if (placeholder) placeholder.hidden = true;
          });
          if (posts.length && !document.querySelector("script[data-instagram-embed]")) {
            const embedScript = document.createElement("script");
            embedScript.src = "https://www.instagram.com/embed.js";
            embedScript.async = true;
            embedScript.dataset.instagramEmbed = "true";
            embedScript.onload = function () {
              if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
            };
            document.body.appendChild(embedScript);
          }
        }
      };
      applyOptionalEmbeds(cookieConsent);
      const cookieBanner = document.createElement("section");
      cookieBanner.className = "cookie-banner";
      cookieBanner.hidden = Boolean(cookieConsent);
      cookieBanner.setAttribute("role", "dialog");
      cookieBanner.setAttribute("aria-labelledby", "cookie-banner-title");
      cookieBanner.innerHTML =
        '<div class="cookie-banner-copy"><span class="eyebrow">Gizlilik tercihleri</span>' +
        '<h2 id="cookie-banner-title">Harita ve Instagram içeriği</h2>' +
        '<p>Google Maps haritası ve Instagram gönderileri, iznin olursa yüklenir. Seçimini dilediğin zaman değiştirebilirsin. <a href="cerez-politikasi.html">Çerez politikası</a> · <a href="kvkk.html">KVKK aydınlatma</a></p></div>' +
        '<div class="cookie-actions"><button class="cookie-choice" type="button" data-cookie-action="accept">Tümüne izin ver</button>' +
        '<button class="cookie-choice" type="button" data-cookie-action="reject">Reddet</button>' +
        '<button class="cookie-choice" type="button" data-cookie-action="settings">Tercihleri yönet</button></div>' +
        '<div class="cookie-preferences" data-cookie-preferences hidden>' +
        '<label><input type="checkbox" data-cookie-map /> Google Maps haritasını yükle</label>' +
        '<label><input type="checkbox" data-cookie-instagram /> Instagram gönderilerini yükle</label>' +
        '<button class="cookie-save" type="button" data-cookie-action="save">Seçimi kaydet</button></div>';
      document.body.appendChild(cookieBanner);
      const preferences = cookieBanner.querySelector("[data-cookie-preferences]");
      const mapPreference = cookieBanner.querySelector("[data-cookie-map]");
      const instagramPreference = cookieBanner.querySelector("[data-cookie-instagram]");
      const showCookieSettings = function () {
        cookieBanner.hidden = false;
        preferences.hidden = false;
        mapPreference.checked = Boolean(cookieConsent && cookieConsent.googleMaps);
        instagramPreference.checked = Boolean(cookieConsent && cookieConsent.instagram);
        mapPreference.focus();
      };
      const saveCookieConsent = function (googleMaps, instagram) {
        cookieConsent = {
          googleMaps: Boolean(googleMaps),
          instagram: Boolean(instagram),
          updatedAt: Date.now(),
          expiresAt: Date.now() + consentLifetime
        };
        try {
          window.localStorage.setItem(consentStorageKey, JSON.stringify(cookieConsent));
        } catch (error) {
          // The choice still applies for this page view if browser storage is unavailable.
        }
        cookieBanner.hidden = true;
        applyOptionalEmbeds(cookieConsent);
      };
      cookieBanner.addEventListener("click", function (event) {
        const action = event.target.closest("[data-cookie-action]");
        if (!action) return;
        if (action.dataset.cookieAction === "accept") saveCookieConsent(true, true);
        if (action.dataset.cookieAction === "reject") saveCookieConsent(false, false);
        if (action.dataset.cookieAction === "settings") showCookieSettings();
        if (action.dataset.cookieAction === "save") saveCookieConsent(mapPreference.checked, instagramPreference.checked);
      });
      document.querySelectorAll("[data-open-cookie-settings]").forEach(function (button) {
        button.addEventListener("click", showCookieSettings);
      });
      const pageHeader = document.querySelector("header");
      const updateHeader = function () {
        if (pageHeader) pageHeader.classList.toggle("is-scrolled", window.scrollY > 80);
      };
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });
      const menuToggle = document.getElementById("menu-toggle");
      const navLinks = document.getElementById("nav-links");
      if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
          const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
          menuToggle.setAttribute("aria-expanded", String(!isOpen));
          navLinks.classList.toggle("is-open", !isOpen);
          menuToggle.textContent = isOpen ? "Menü" : "Kapat";
        });
        navLinks.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () {
            navLinks.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "Menü";
          });
        });
      }
      document.querySelectorAll("[data-service]").forEach(function (link) {
        link.addEventListener("click", function () {
          const serviceField = document.getElementById("service");
          if (serviceField) serviceField.value = link.dataset.service;
        });
      });
      const heroVideo = document.getElementById("hero-video");
      if (heroVideo) {
        const heroSection = heroVideo.closest(".hero");
        const gestureEvents = ["touchstart", "pointerdown", "click"];
        let playPending = false;
        heroVideo.muted = true;
        heroVideo.defaultMuted = true;
        heroVideo.setAttribute("muted", "");
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        heroVideo.setAttribute("playsinline", "");
        heroVideo.setAttribute("webkit-playsinline", "");
        const showHeroFallback = function () {
          if (heroSection) heroSection.classList.add("hero-video-fallback");
        };
        const removeGestureRetries = function () {
          gestureEvents.forEach(function (eventName) {
            window.removeEventListener(eventName, startHeroVideo);
          });
        };
        const onHeroPlaying = function () {
          playPending = false;
          if (heroSection) heroSection.classList.remove("hero-video-fallback");
          removeGestureRetries();
        };
        const startHeroVideo = function () {
          if (document.hidden || !heroVideo.paused || playPending) return;
          playPending = true;
          let playback;
          try {
            playback = heroVideo.play();
          } catch (error) {
            playPending = false;
            showHeroFallback();
            return;
          }
          if (playback && typeof playback.then === "function") {
            playback.then(function () {
              playPending = false;
            }).catch(function () {
              playPending = false;
              showHeroFallback();
            });
          } else {
            playPending = false;
          }
        };
        heroVideo.addEventListener("playing", onHeroPlaying);
        heroVideo.addEventListener("error", showHeroFallback);
        heroVideo.addEventListener("loadeddata", startHeroVideo, { once: true });
        heroVideo.addEventListener("canplay", startHeroVideo, { once: true });
        gestureEvents.forEach(function (eventName) {
          window.addEventListener(eventName, startHeroVideo, { passive: true });
        });
        document.addEventListener("visibilitychange", function () {
          if (!document.hidden) startHeroVideo();
        });
        window.addEventListener("pageshow", startHeroVideo);
        startHeroVideo();
      }
      const serviceField = document.getElementById("service");
      const serviceKey = new URLSearchParams(window.location.search).get("hizmet");
      const serviceLabels = {
        ppf: "PPF kaplama",
        cam: "Cam filmi",
        seramik: "Seramik kaplama",
        pasta: "Pasta & cila",
        detayli: "Detaylı temizlik",
        diger: "Diğer"
      };
      if (serviceField && serviceLabels[serviceKey]) {
        serviceField.value = serviceLabels[serviceKey];
      }
      const preferredDateField = document.getElementById("preferred-date");
      if (preferredDateField) {
        const today = new Date();
        const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
        preferredDateField.min = localToday;
      }
      const serviceFinder = document.getElementById("service-finder");
      if (serviceFinder) {
        const recommendations = {
          ppf: { name: "PPF kaplama", service: "ppf", url: "ppf-kaplama.html", summary: "Boya yüzeyi üzerinde fiziksel film koruması isteyenler için değerlendirilebilir." },
          seramik: { name: "Seramik kaplama", service: "seramik", url: "seramik-kaplama.html", summary: "Parlaklık ve düzenli bakımı kolaylaştırmaya yönelik yüzey koruması arayanlar için değerlendirilebilir." },
          cam: { name: "Cam filmi", service: "cam", url: "cam-filmi.html", summary: "Cam filmi seçeneği güneş, UV ve mahremiyet beklentinize göre belirlenebilir." },
          pasta: { name: "Pasta & cila", service: "pasta", url: "pasta-cila.html", summary: "Boya yüzeyindeki matlık ve uygun ince izler için ön değerlendirme yapılabilir." },
          detayli: { name: "Detaylı temizlik", service: "detayli", url: "detayli-temizlik.html", summary: "İç ve dış yüzeylerin ihtiyacına göre temizlik uygulaması planlanabilir." },
          diger: { name: "Araca özel çözüm", service: "diger", url: "araca-ozel-cozum.html", summary: "Önceliğiniz net değilse araç ve beklentiniz birlikte değerlendirilir." }
        };
        serviceFinder.addEventListener("submit", function (event) {
          event.preventDefault();
          const recommendation = recommendations[document.getElementById("finder-goal").value];
          const condition = document.getElementById("finder-condition").value;
          const result = document.getElementById("service-finder-result");
          if (!recommendation || !result) return;
          let guidance = "Bu, ilk yönlendirmedir; kesin uygulama aracın yüzeyi ve beklentiniz görüldükten sonra netleşir.";
          const paintService = ["ppf", "seramik", "pasta"].includes(document.getElementById("finder-goal").value);
          if (paintService && condition === "issue") guidance = "Çizik, matlık veya leke belirttiğiniz için, işlemden önce boya yüzeyinin görülmesi ve uygun hazırlığın değerlendirilmesi önemlidir.";
          if (paintService && condition === "unknown") guidance = "Boya yüzeyinden emin değilseniz, işlem seçimini aracı gördükten sonra birlikte netleştirebiliriz.";
          result.innerHTML = '<div><span class="service-no">Size uygun olabilecek hizmet</span><h3>' + recommendation.name + '</h3><p>' + recommendation.summary + '</p><p class="finder-guidance">' + guidance + '</p><div class="finder-result-actions"><a class="button dark" href="' + recommendation.url + '">Hizmet detayları</a><a class="service-link" href="iletisim.html?hizmet=' + recommendation.service + '#randevu">Bu hizmet için randevu iste <span aria-hidden="true">↗</span></a></div></div>';
          result.hidden = false;
          result.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
      const gallerySlots = document.querySelectorAll("[data-gallery-slot]");
      const galleryEmptyState = document.getElementById("gallery-empty-state");
      let visibleGalleryCount = 0;
      gallerySlots.forEach(function (slot) {
        const imageUrl = (slot.dataset.imageUrl || "").trim();
        const image = slot.querySelector("[data-gallery-image]");
        const caption = slot.querySelector("[data-gallery-caption]");
        if (!imageUrl || !image || !caption) return;
        const service = (slot.dataset.service || "Uygulama").trim();
        const vehicle = (slot.dataset.vehicle || "").trim();
        const customCaption = (slot.dataset.caption || "").trim();
        image.alt = [vehicle, service, "BRK Garage uygulaması"].filter(Boolean).join(" · ");
        image.addEventListener("error", function () {
          slot.hidden = true;
          visibleGalleryCount -= 1;
          if (galleryEmptyState && visibleGalleryCount === 0) galleryEmptyState.hidden = false;
        }, { once: true });
        image.src = imageUrl;
        image.hidden = false;
        caption.textContent = customCaption || [vehicle, service].filter(Boolean).join(" · ");
        caption.hidden = false;
        slot.hidden = false;
        visibleGalleryCount += 1;
      });
      if (galleryEmptyState) galleryEmptyState.hidden = visibleGalleryCount > 0;
      document.querySelectorAll("[data-comparison]").forEach(function (stage) {
        const slider = stage.querySelector(".compare-range");
        if (!slider) return;
        const updateComparison = function () {
          stage.style.setProperty("--comparison", slider.value + "%");
        };
        slider.addEventListener("input", updateComparison);
        updateComparison();
      });
      const bookingForm = document.getElementById("booking-form");
      if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const name = document.getElementById("name").value.trim();
          const phone = document.getElementById("phone").value.trim();
          const vehicle = document.getElementById("vehicle").value.trim();
          const service = document.getElementById("service").value;
          const preferredDate = document.getElementById("preferred-date");
          const preferredTime = document.getElementById("preferred-time");
          const note = document.getElementById("note").value.trim();
          let appointmentPreference = "Belirtilmedi";
          if (preferredDate && preferredDate.value) {
            const date = new Date(preferredDate.value + "T12:00:00");
            appointmentPreference = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(date);
          }
          if (preferredTime && preferredTime.value) {
            appointmentPreference = appointmentPreference === "Belirtilmedi" ? preferredTime.value : appointmentPreference + " · " + preferredTime.value;
          }
          const message = [
            "Merhaba BRK Garage, web sitenizden randevu/teklif talebi oluşturmak istiyorum.",
            "",
            "Ad Soyad: " + name,
            "Telefon: " + phone,
            "Araç marka / model / yıl: " + vehicle,
            "İlgilendiğim hizmet: " + service,
            "Tercih ettiğim zaman (uygunluk teyidi gerekir): " + appointmentPreference,
            note ? "Not: " + note : ""
          ].filter(Boolean).join("\n");
          window.open("https://wa.me/905441723633?text=" + encodeURIComponent(message), "_blank", "noopener");
        });
      }
