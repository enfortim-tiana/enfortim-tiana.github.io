!(function () {
  const CHARACTER_DELAY = 100;
  const WORD_DELAY = 1000;
  const LAST_WORD_DELAY = 10000;
  const STATE_ERASING = "erasing";
  const STATE_WRITING = "writing";
  const STATE_NEXT = "next";

  class TextChanger {
    constructor(textElement) {
      this.textElement = textElement;
      this.texts = this.textElement.getAttribute("data-change-text").split(";");
      this.currentTextIndex = 0;
      this.charIndex = 0; // this.texts[this.currentTextIndex].length;
      this.state = STATE_WRITING;
      this.createCursor();
      this.createStyles();
      this.start();
    }

    createCursor() {
      this.cursorElement = document.createElement("span");
      this.cursorElement.classList.add("cursor");
      this.textElement.parentNode.insertBefore(
        this.cursorElement,
        this.textElement.nextSibling
      );
    }

    createStyles() {
      let styleElement = document.createElement("style");
      styleElement.innerHTML = `
        @keyframes blink {
          0% {opacity: 1.0;}
          50% {opacity: 0.0;}
          100% {opacity: 1.0;}
        }
        .cursor {
          animation: blink 1s infinite;
          display: inline-block;
          height: 1em;
          width: 0.05em;
          background-color: #000;
          vertical-align: middle;
        }
      `;
      document.head.appendChild(styleElement);
    }

    start() {
      this.changeText();
    }

    changeText() {
      const currentText = this.texts[this.currentTextIndex];

      switch (this.state) {
        case STATE_ERASING:
          this.eraseCharacter(currentText);
          break;
        case STATE_WRITING:
          this.writeCharacter(currentText);
          break;
        default:
          this.nextText();
      }
    }

    eraseCharacter(currentText) {
      this.textElement.innerHTML = currentText.slice(0, this.charIndex--);
      setTimeout(() => this.changeText(), CHARACTER_DELAY);

      if (this.charIndex < 0) {
        this.charIndex = 0;
        this.state = STATE_NEXT;
      }
    }

    writeCharacter(currentText) {
      this.textElement.innerHTML = currentText.slice(0, this.charIndex++);

      if (this.charIndex > currentText.length) {
        this.state = STATE_ERASING;
        const isLastText = this.currentTextIndex === this.texts.length - 1;
        setTimeout(
          () => this.changeText(),
          isLastText ? LAST_WORD_DELAY : WORD_DELAY
        );
      } else {
        setTimeout(() => this.changeText(), CHARACTER_DELAY);
      }
    }

    nextText() {
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      this.state = STATE_WRITING;

      const isLastText = this.currentTextIndex === this.texts.length - 1;
      if (isLastText) {
        this.textElement.classList.add("text-primary");
      } else {
        this.textElement.classList.remove("text-primary");
      }

      setTimeout(() => this.changeText(), CHARACTER_DELAY);
    }
  }

  document
    .querySelectorAll("[data-change-text]")
    .forEach((element) => new TextChanger(element));
})();
