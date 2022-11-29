function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

function loadItemsHome(page) {
    var offset = 0;
    var numItemInPage = 15;
    if(page > 1) {
        offset = numItemInPage * (page - 1);
    }
    var html = '';
    var length = Object.keys(dataClips).length;
    for (var id = (length - offset); id >= ((length - offset)-numItemInPage+1); id--) {
        if(dataClips[id]){
            html += `<div class="item row border-bottom border-bottom-dashed my-4">
                        <div class="col-4 px-0">
                            <a class="d-block text-primary text-decoration-none" href="/?clip=${id}" target="_blank">Clip ${id}</a>
                        </div>
                        <div class="col-8 text-end px-0 text-nowrap overflow-hidden">${dataClips[id].tags}</div>
                    </div>`;
        }
    }
    $('.items').html(html);
    if (Object.keys(dataClips).length > numItemInPage) {
        var html = '';
        for (var i = 1; i <= Math.ceil(Object.keys(dataClips).length / numItemInPage); i++) {
            if(i == page) {
                html += `<li class="page-item active" aria-current="page">
                          <span class="page-link">${i}</span>
                        </li>`;
            } else {
                html += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
            }
        }
        $('.pagination').html(html);
    }
}

function loadItemClip(id) {
    var clip = dataClips[id];
    var html = '';
    html += `<h1 class="fs-3">Clip sex ${id}</h1>`;
    var i = 1;
    for (var index in dataClips[id].urls) {
        html += `<div class="item mt-4 mb-5">`;
        html += `<iframe width="100%" height="360" frameborder="0" src="${dataClips[id].urls[index]}" allowfullscreen ></iframe>`;
        if (Object.keys(dataClips[id].urls).length > 1) {
          html += `<p class="fw-bold text-center">Phần ${i}</p>`;
        }
        html += `</div>`;
        i++;
    }
    html += `<div class="pt-0 border-bottom"><h2 class="fs-3">Bạn Muốn Xem Tiếp?</h2></div>`;
    html += `<div class="px-3">`;
    var indexed = 0;
    var html2 = '';
    for (var i = 1; i <= 3; i++) {
        var index = id + i;
        if(dataClips[index]) {
            indexed += 1;
            html2 += `<div class="item row border-bottom border-bottom-dashed my-3">
                        <div class="col-4 px-0">
                            <a class="d-block text-primary text-decoration-none" href="/?clip=${index}">Clip ${index}</a>
                        </div>
                        <div class="col-8 text-end px-0 text-nowrap overflow-hidden">${dataClips[index].tags}</div>
                    </div>`;
        }
    }

    if (indexed < 6) {
        for (var i = 1; i <= (6-indexed); i++) {
            var index = id - i;
            if(dataClips[index]) {
                html2 += `<div class="item row border-bottom border-bottom-dashed my-4">
                            <div class="col-4 px-0">
                                <a class="d-block text-primary text-decoration-none" href="/?clip=${index}">Clip ${index}</a>
                            </div>
                            <div class="col-8 text-end px-0 text-nowrap overflow-hidden">${dataClips[index].tags}</div>
                        </div>`;
            }
        }
    }
    html += html2;

    html += `</div>`;

    html += `<div class="pt-0 border-bottom"><h2 class="fs-3">Clip Sex Mới Nhất</h2></div>`;
    html += `<div class="px-3">`;
    var length = Object.keys(dataClips).length;
    for (var i = length; i >= (length - 5); i--) {
        if(dataClips[i]) {
            html += `<div class="item row border-bottom border-bottom-dashed my-3">
                        <div class="col-4 px-0">
                            <a class="d-block text-primary text-decoration-none" href="/?clip=${i}">Clip ${i}</a>
                        </div>
                        <div class="col-8 text-end px-0 text-nowrap overflow-hidden">${dataClips[i].tags}</div>
                    </div>`;
        }
    }
    html += `</div>`;
    $('.items').html(html);
}

$( document ).ready(function() {
    includeHTML();
    let searchParams = new URLSearchParams(window.location.search);
    var page = 1;

    if (searchParams.has('page')) {
        if(parseInt(searchParams.get('page')) > 0) {
            page = parseInt(searchParams.get('page'));
        }
    }

    if (searchParams.has('clip')) {
        if(parseInt(searchParams.get('clip')) > 0) {
            loadItemClip(parseInt(searchParams.get('clip')));
        } else {
            loadItemsHome(page);
        }
    } else {
        loadItemsHome(page);
    }
});
