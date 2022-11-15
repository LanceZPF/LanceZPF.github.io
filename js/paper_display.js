var html = ""

window.onload = function() {
    var url = "../paper.json"
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if(request.status == 200) {
            var obj = JSON.parse(request.responseText);
            console.log(obj);
            for(var i=0; i<obj.length; i++) {
                var title = obj[i].title
                var author = obj[i].author
                var image = obj[i].image
                var pdf = obj[i].pdf
                var publisher = obj[i].publisher
                var year = obj[i].year
                var equal = obj[i].equal
                var oral = obj[i].oral
                var description = obj[i].description
                
                
                oral_str = ""
                if(oral == true) {
                    oral_str = "  (Oral)"
                }

                var equal_str = ""
                if(equal == true) {
                    equal_str = "  (* Equal contribution)"
                }

                for(var j=0 ; j<author.length ; j++){
                    if(author[j] == "Pengfei Zhou" || author[j] == "Pengfei Zhou*"){
                        author[j] = "<b>" + author[j] + "</b>";
                    }
                    
                }
                var author_str = author.join(', ');

                var meta = obj[i].meta
                
                var meta_array = []
                for(let key in meta){
                    if(meta[key] != false){ 
                        meta_array.push("<a href=" + meta[key] + ">" + key + "</a>")
                    }
                }
                var meta_str = meta_array.join('  /  ')
            

                html += 
                "\
                <tr bgcolor='#ffffff'>\
                    <td style='padding:20px;width:35%;vertical-align:middle'>\
                        <img src= " + image + " width='250'></div>\
                    </td>\
                    <td width='75%' valign='middle'>\
                    <p>\
                        <a href=" + pdf + " style='font-size:18px'>" + title + "</a> &nbsp&nbsp\
                        <br>" + author_str + 
                        "<br>\
                        <em>"+ publisher + "  " + year + oral_str + equal_str + "</em>,\
                        <br>\
                        <font color='black'> " + description +"<br>\
                        " + meta_str + " <br> \
                    </font>\
                        <br>\
                    </td>\
                </tr>\
                "
            }
            document.getElementById("paper").innerHTML = html;
        }
    }
}
