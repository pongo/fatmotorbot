"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function presentUserData(data) {
    const gender = data.gender === 'female' ? 'Женщина' : 'Мужчина';
    return `${gender}, ${data.height} см`;
}
exports.presentUserData = presentUserData;
//# sourceMappingURL=shared.js.map