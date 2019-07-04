const compare = (a, b) => {
    if (!b)
        return a;
    else
        if (a >= b) {
            return a;
        } else {
            return b;
        }
};

module.exports = {
    compare: compare
};