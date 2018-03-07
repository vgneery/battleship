'use strict';

import utils from 'utils';

export default class Field {
    constructor () {
        this.size = 300;
        this.shipSize = 30;
        this.shipsData  = [
            {type: 'fourdeck', amount: 1, size: 4},
            {type: 'tripledeck', amount: 2, size: 3},
            {type: 'doubledeck', amount: 3, size: 2},
            {type: 'singledeck', amount: 4, size: 1}
        ];

        this.element = element;
        this.elementX = element.getBoundingClientRect().top + pageYOffset;
        this.elementY = element.getBoundingClientRect().left + pageXOffset;
        this.elementRight = this.elementY + this.size;
        this.elementBtm = this.elementX + this.size;
        this.squadron = [];
    }

    randomLocationShips () {
        this.matrix = utils.createMatrix();
        var data = this.shipsData;
        for (var i = 1, length = data.length; i < length; i++) {
            var decks = data[i].size; // кол-во палуб
            var amount = data[i].amount; // кол-во кораблей
            for (var j = 0; j < amount; j++) {
                // получаем координаты первой палубы и направление расположения палуб (корабля)
                var fc = this.getCoordinatesDecks(decks);
                fc.decks = decks;
                fc.shipname = data[i].type + String(j + 1);
                // создаём экземпляр корабля и выводим на экран
                // var ship = new Ships(this, fc);
                // ship.createShip();
            }
        }
    }

    getCoordinatesDecks (decks) {
        // kx == 1 - вертикально, ky == 1 - горизонтально
        var kx = utils.getRandom(1),
            ky = (kx == 0) ? 1 : 0,
            x, y;

        if (kx == 0) {
            x = utils.getRandom(9);
            y = utils.getRandom(10 - decks);
        } else {
            x = utils.getRandom(10 - decks);
            y = utils.getRandom(9);
        }

        // валидация палуб корабля
        var result = this.checkLocationShip(x, y, kx, ky, decks);
        if (!result) return this.getCoordinatesDecks(decks);

        var obj = {
            x: x,
            y: y,
            kx: kx,
            ky: ky
        };
        return obj;
    }

    checkLocationShip (x, y, kx, ky, decks) {
        var fromX, toX, fromY, toY;

        fromX = (x == 0) ? x : x - 1;
        if (x + kx * decks == 10 && kx == 1) toX = x + kx * decks;
        else if (x + kx * decks < 10 && kx == 1) toX = x + kx * decks + 1;
        else if (x == 9 && kx == 0) toX = x + 1;
        else if (x < 9 && kx == 0) toX = x + 2;

        fromY = (y == 0) ? y : y - 1;
        if (y + ky * decks == 10 && ky == 1) toY = y + ky * decks;
        else if (y + ky * decks < 10 && ky == 1) toY = y + ky * decks + 1;
        else if (y == 9 && ky == 0) toY = y + 1;
        else if (y < 9 && ky == 0) toY = y + 2;

        // если корабль при повороте выходит за границы игрового поля
        // т.к. поворот происходит относительно первой палубы, то 
        // fromX и from, всегда валидны
        if (toX === undefined || toY === undefined) return false;

        for (var i = fromX; i < toX; i++) {
            for (var j = fromY; j < toY; j++) {
                if (this.matrix[i][j] == 1) return false;
            }
        }
        return true;
    }
};