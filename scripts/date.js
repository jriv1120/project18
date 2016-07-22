var makeDate = function() {
    //custom date maker
    var d = new Date();
    var formattedDate = "";
    formattedDate = formattedDate + (d.getMonth() + 1) + "_";
    formattedDate = formattedDate + d.getDate() + "_";
    formattedDate = formattedDate + d.getFullYear();
    return formattedDate;
};

module.exports = makeDate;