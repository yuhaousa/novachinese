(function () {
  function setupChatPage() {
    const personas = document.querySelectorAll('.persona-card');
    personas.forEach((card) => {
      card.addEventListener('click', () => {
        personas.forEach((item) => item.classList.remove('active'));
        card.classList.add('active');
      });
    });

    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach((item) => {
      item.addEventListener('click', () => {
        historyItems.forEach((entry) => entry.classList.remove('active'));
        item.classList.add('active');
      });
    });

    const input = document.querySelector('.chat-input-area');
    if (input instanceof HTMLTextAreaElement) {
      const resizeInput = () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 180) + 'px';
      };

      document.querySelectorAll('.suggest-item').forEach((button) => {
        button.addEventListener('click', () => {
          input.value = button.textContent.trim();
          resizeInput();
          input.focus();
        });
      });

      input.addEventListener('input', resizeInput);
      resizeInput();
    }
  }

  function setupSettingsPage() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        navItems.forEach((entry) => entry.classList.remove('active'));
        item.classList.add('active');

        const section = item.getAttribute('data-section');
        if (!section) return;

        const target = document.getElementById('section-' + section);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const fontSlider = document.getElementById('font-size-slider');
    const fontValue = document.getElementById('font-size-value');
    const fontPreview = document.getElementById('font-preview');
    if (
      fontSlider instanceof HTMLInputElement &&
      fontValue &&
      fontPreview
    ) {
      const updateFontSize = () => {
        const size = fontSlider.value + 'px';
        fontValue.textContent = size;
        fontPreview.style.fontSize = size;
      };

      fontSlider.addEventListener('input', updateFontSize);
      updateFontSize();
    }

    document.querySelectorAll('.segment').forEach((control) => {
      control.addEventListener('click', (event) => {
        const target = event.target;
        if (
          !(target instanceof HTMLElement) ||
          !target.classList.contains('segment-item')
        ) {
          return;
        }

        control
          .querySelectorAll('.segment-item')
          .forEach((item) => item.classList.remove('active'));
        target.classList.add('active');

        const fontGroup = control.closest('.pref-item');
        if (!fontGroup || !fontPreview || !fontGroup.querySelector('#font-preview')) {
          return;
        }

        const options = Array.from(control.querySelectorAll('.segment-item'));
        const optionIndex = options.indexOf(target);
        if (optionIndex === 0) {
          fontPreview.style.fontFamily = "'Noto Serif SC', serif";
        } else if (optionIndex === 1) {
          fontPreview.style.fontFamily = "'Noto Sans SC', sans-serif";
        } else if (optionIndex === 2) {
          fontPreview.style.fontFamily = "'Ma Shan Zheng', serif";
        }
      });
    });

    const swatches = document.querySelectorAll('.theme-swatch');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        swatches.forEach((item) => item.classList.remove('active'));
        swatch.classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupChatPage();
    setupSettingsPage();
  });
})();
