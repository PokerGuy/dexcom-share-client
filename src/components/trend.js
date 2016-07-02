exports.trendsToText = function(number) {
    switch (number) {
        case 0:
            return "None";
        case 1:
            return "Double Up";
        case 2:
            return "Single Up";
        case 3:
            return "Forty Five Degrees Up";
        case 4:
            return "Flat";
        case 5:
            return "Forty Five Degrees Down";
        case 6:
            return "Single Down";
        case 7:
            return "Oh Shit! Double Down";
        case 8:
            return "Cannot compute";
        case 9:
            return "Rate out of Range";
    }
    return "Well, I am flumoxxed";
};
