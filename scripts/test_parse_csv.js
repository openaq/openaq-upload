'use strict';

function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};

let test = '"one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"\r\n"2nd line one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"';
test = `so2,Koniczynka,Koniczynka,PL,4.7,µg/m³,"{""utc"":""2020-09-17T18:00:00Z"",""local"":""2020-09-17T20:00:00+02:00""}",GIOS,government,,"{""latitude"":53.080647,""longitude"":18.684258}",,`
console.log(csvToArray(test));