var letterSounds = {
    "А": "а.m4a",
    "Б": "б.m4a",
    "В": "в.m4a",
    "Г": "г.m4a", 
    "Д": "д.m4a",
    "Е": "е.m4a",
    "Ё": "ё.m4a",
    "Ж": "ж.m4a",
    "З": "з.m4a",
    "И": "и.m4a",
    "Й": "й.m4a",
    "К": "к.m4a",
    "Л": "л.m4a",
    "М": "м.m4a",
    "Н": "н.m4a",
    "О": "о.m4a",
    "П": "п.m4a",
    "Р": "р.m4a",
    "С": "с.m4a",
    "Т": "т.m4a",
    "У": "у.m4a",
    "Ф": "ф.m4a",
    "Х": "х.m4a",
    "Ц": "ц.m4a",
    "Ч": "ч.m4a",
    "Ш": "ш.m4a",
    "Щ": "щ.m4a",
    "Ъ": "#",
    "Ы": "ы.m4a",
    "Ь": "#",
    "Э": "э.m4a",
    "Ю": "ю.m4a",
    "Я": "я.m4a"
};

var fileLettersSound = "sounds/letters";

class Game {
    levels = [
        new Level("ФРУКТЫ", "images/fruits.png", "#"),
        new Level("КИВИ", "images/kivy.png", "sounds/qiwi.m4a"), new Level("АНАНАС", "images/ananas.jpg", "sounds/ananas.m4a"),
        new Level("ЯБЛОКО", "images/apple.png", "sounds/apple.m4a"), new Level("ЛИМОН", "images/lemon.png", "sounds/lemon.m4a"),
        new Level("АПЕЛЬСИН", "images/orange.png", "sounds/orange.m4a"), new Level("БАНАН", "images/banana.png", "sounds/banana.m4a"),
    
        new Level("ОВОЩИ", "images/vegetables.png", "#"),
        new Level("ЛУК", "images/onion.png", "#"), new Level("ОГУРЕЦ", "images/pickle.png", "#"), new Level("ПОМИДОР", "images/tomato.png", "#"), 
        new Level("КАРТОШКА", "images/potato.png", "#"), new Level("МОРКОВЬ", "images/carrot.png", "#")
    ];


    curLevel = 0;
    pause = false;
    isRepeat = false;

    constructor() {
        this.levels[this.curLevel].start();
    }

    builded() {
        this.pause = true;
        let img = document.createElement("img");
        img.classList.add("img");
        img.src = "images/arrow.jpg";
        img.style.maxHeight = "35vh";
        this.levels[this.curLevel].letters.appendChild(img);

        var a = true;

        this.levels[this.curLevel].letters.onclick = function() {
            if (a) {
                a = false;
            } else {
                game.next();
            }
        };
    }

    next() {
        sound("sounds/win.mp3");
        this.levels[this.curLevel].letters.onclick = function() {};

        if (this.curLevel + 1 == this.levels.length) {
            this.end();
        } else {
            while (this.levels[this.curLevel].output.firstChild) {
                this.levels[this.curLevel].output.removeChild(this.levels[this.curLevel].output.firstChild);
            }

            while (this.levels[this.curLevel].letters.firstChild) {
                this.levels[this.curLevel].letters.removeChild(this.levels[this.curLevel].letters.firstChild);
            }

            if (!this.isRepeat) {
                this.curLevel++;
            } else {
                this.isRepeat = false;
            }
            this.levels[this.curLevel].start();
        }
        this.pause = false;
    }

    end() {
        this.isRepeat = true;
        this.curLevel = 0;
        this.next()
    }
}

class Level {
    vowels = ['У', 'Е', 'Э', 'О', 'Ы', 'Я', 'И', 'А'];

    letters = document.getElementById("letters");
    output = document.getElementById("word");

    lettersArray = [];
    outputArray = [];

    mainImage = document.getElementById("mainImage");
    mainImageDiv = document.getElementById("mainImageDiv")

    constructor(word, SRCmainImage, SRCmainSound) {
        this.word = word;
        this.srcMainImage = SRCmainImage;
        this.srcMainSound = SRCmainSound;
    }

    start() {
        var mainSound = this.srcMainSound;
        var letters = this.letters;
        var output = this.output;

        var elem;

        var lettersArray = this.lettersArray;
        var outputArray = this.outputArray;
        this.mainImage.src = this.srcMainImage;
        this.mainImageDiv.onclick = function() {
            sound(mainSound);
        };

        for (let i = 0; i < this.word.length; i++) {
            elem = document.createElement("div");
            elem.id = "letter " + i;
            if (this.vowels.indexOf(this.word.charAt(i)) != -1) {
                elem.classList.add("vowels");
            } else {
                elem.classList.add("consonant");
            }
            elem.classList.add("letter");

            resizeLetter(this.letters, elem, this.word.length);

            if (this.word.charAt(i) == " ") {
                elem.innerText = "_"; 
            } else {
                elem.innerText = this.word.charAt(i);
            }

            elem.onclick = function() {
                if (lettersArray[0].innerText == event.currentTarget.innerText) {
                    lettersArray[lettersArray.indexOf(event.currentTarget)] = lettersArray[0];
                    lettersArray[0] = event.currentTarget;
                    lettersArray.splice(0, 1);

                    outputArray.push(event.currentTarget);
                    resizeAll(output, outputArray);

                    letters.removeChild(event.currentTarget);
                    event.currentTarget.onclick = function() {
                        sound(fileLettersSound + "/" + letterSounds[event.currentTarget.innerText]);
                    };
                    output.appendChild(event.currentTarget);

                    if (letters.children.length == 0) {
                        game.builded();
                    } else {
                        resizeAll(letters, lettersArray);
                    }
                    sound(fileLettersSound + "/" + letterSounds[event.currentTarget.innerText]);
                } else {
                    sound("sounds/lose.mp3");
                }
            };

            lettersArray[i] = elem;
        }

        var used = [];
        while (used.length != this.word.length) {
            let i = Math.floor(Math.random() * this.word.length);  
            while (used.indexOf(i) != -1) {
                if (used.length + 1 == this.word.length) {
                    i = (i + 1) % this.word.length;
                } else {
                    i = Math.floor(Math.random() * this.word.length);
                }
            }
            used.push(i);

            this.letters.appendChild(lettersArray[i]);
        }
    }
}

game = new Game();

window.addEventListener("resize", AutoScale);

function AutoScale() {
    if (!game.pause) {
        for (let i = 0; i < game.levels[game.curLevel].letters.children.length; i++) {
            resizeLetter(game.levels[game.curLevel].letters, game.levels[game.curLevel].letters.children[i], game.levels[game.curLevel].lettersArray.length);
        }
    }

    for (let i = 0; i < game.levels[game.curLevel].output.children.length; i++) {
        resizeLetter(game.levels[game.curLevel].output, game.levels[game.curLevel].output.children[i], game.levels[game.curLevel].outputArray.length);
    }
}

function resizeAll(container, elems) {
    for (let i = 0; i < elems.length; i++) {
        resizeLetter(container, elems[i], elems.length);
    }
}

function resizeLetter(container, elem, count) {
    width = container.clientWidth;
    height = container.clientHeight;

    var size = width / (0.35 + count);

    var cof = 0.6;
    if (size > height * cof) {
        size = height * cof;
    }
    if (size > width * cof) {
        size = width * cof;
    }

    elem.style.fontSize = String(Math.round(size)) + "px";
    elem.style.width = String(Math.round(size)) + "px";
};

function sound(src) {
    var sound = new Audio();
    sound.src = src;
    sound.play();
}