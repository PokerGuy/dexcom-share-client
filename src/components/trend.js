exports.trendsToText = function(number) {
    switch (number) {
        case 0:
            return "None";
        case 1:
            return '<i class="fa fa-arrow-up fa-3x"/><i class="fa fa-arrow-up fa-3x"/>';
        case 2:
            return '<i class="fa fa-arrow-up fa-3x"/>';
        case 3:
			//forty five up
            return '<i class="fa fa-arrow-right fa-rotate-45-up fa-3x"/>';
        case 4:
            return '<i class="fa fa-arrow-right fa-3x"/>';
        case 5:
			//45 down
            return '<i class="fa fa-arrow-right fa-rotate-45-down fa-3x"/>';
        case 6:
            return '<i class="fa fa-arrow-down fa-3x"/>';
        case 7:
            return '<i class="fa fa-arrow-down fa-3x"/><i class="fa fa-arrow-down fa-3x"/>';
        case 8:
            return "Cannot compute";
        case 9:
            return "Rate out of Range";
    }
    return "Well, I am flumoxxed";
};
