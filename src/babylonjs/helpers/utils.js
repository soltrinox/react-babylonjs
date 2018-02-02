const equals = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    if (typeof a === "object" && typeof b === "object") {
        for (let key in a) {
            if (equals(a[key], b[key]) === false) {
                return false;
            }
        }

        for (let key in b) {
            if (equals(a[key], b[key]) === false) {
                return false;
            }
        }

        return true;
    }

    return a === b;
};

const clone = obj => {
    if (Array.isArray(obj)) {
        return obj.slice(0);
    }

    if (obj instanceof Date) {
        return new Date(obj);
    }

    if (typeof obj !== "object") {
        return obj.valueOf();
    }

    const newObj = Object.assign({}, obj);

    for (let key in obj) {
        newObj[key] = clone(obj[key]);
    }

    return newObj;
};

module.exports = { clone, equals };
