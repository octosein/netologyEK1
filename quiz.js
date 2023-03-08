const { MESSAGE_TYPES } = require('./const');

module.exports = class Quiz {
  static parseNumber(line) {
    const number = parseInt(line);

    return Number.isInteger(number)
      ? number
      : null;
  }

  constructor(readlineInstance) {
    this.rl = readlineInstance;
    this.numberToGuess = null;
  }

  init() {
    this.rl.setPrompt('Введите максимальное число: ');
    this.rl.prompt();

    this.rl
      .on('line', (line) => {
        const { message, text } = this.play(line);

        switch (message) {
          case MESSAGE_TYPES.stop:
            this.rl.setPrompt(text.concat('\n'));
            this.rl.prompt();
            this.rl.close();

          case MESSAGE_TYPES.error:
          case MESSAGE_TYPES.begin:
          case MESSAGE_TYPES.smaller:
          case MESSAGE_TYPES.greater:
          default:
            this.rl.setPrompt(text.concat('\n'));
        }

        this.rl.prompt();
      })
      .on('close', () => {
        process.exit(0);
      });
  }

  play(line) {
    const number = Quiz.parseNumber(line);

    if (number === null) {
      return {
        message: MESSAGE_TYPES.error,
        text: 'Введено не число. Введите число',
      };
    }

    if (this.numberToGuess === null) {
      this.numberToGuess = Math.round(Math.random() * number);

      return {
        message: MESSAGE_TYPES.begin,
        text: `Старт! Попробуйте угадать число от 0 до ${number}...`,
      };
    }

    if (number === this.numberToGuess) {
      return {
        message: MESSAGE_TYPES.stop,
        text: 'Победа',
      };
    }

    if (number < this.numberToGuess) {
      return {
        message: MESSAGE_TYPES.smaller,
        text: 'Загаданное число больше!',
      };
    }

    if (number > this.numberToGuess) {
      return {
        message: MESSAGE_TYPES.greater,
        text: 'Загаданное число меньше!',
      };
    }
  }
}
