var enterButton = document.getElementById('enter');
var input = document.getElementById('userInput');
var ul = document.querySelector('ul');
var item = document.getElementsByTagName('li');
const songList = document.getElementById('songList');
const lyrics = document.getElementById('lyrics');
const songListUl = document.getElementById('songListUl');

const searchUrl = 'https://api.lyrics.ovh/suggest/searchQuery';
const lyricsUrl = 'https://api.lyrics.ovh/v1/artist/title';
const xmlHttp = new XMLHttpRequest();

function inputLength() {
  return input.value.length;
}

function listLength() {
  return item.length;
}

function createListElement(artist, title) {
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(artist + ' ' + title));
  ul.appendChild(li);
  function crossOut() {
    li.classList.toggle('done');
  }

  var dBtn = document.createElement('button');
  dBtn.appendChild(document.createTextNode('Show Lyrics'));
  li.appendChild(dBtn);
  dBtn.addEventListener('click', deleteListItem);

  function deleteListItem() {
    let lyricsUrlModified = lyricsUrl.replace('artist', artist);
    lyricsUrlModified = lyricsUrlModified.replace('title', title);
    xmlHttp.open('GET', lyricsUrlModified, true); // true for asynchronous
    xmlHttp.send(null);

    xmlHttp.onreadystatechange = function () {
      songList.style.display = 'none';
      lyrics.style.display = 'block';
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        const lyricsReceived = JSON.parse(xmlHttp.responseText);
        console.log(lyricsReceived);
        console.log(lyricsReceived.lyrics);
        if (lyricsReceived.lyrics == '') {
          lyrics.innerHTML = 'Lyrics Not Found';
        } else {
          lyrics.innerHTML = lyricsReceived.lyrics;
        }
      }
    };
  }
}

function addListAfterClick() {
  if (inputLength() > 0) {
    const searchQuery = input.value;

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        songListUl.innerHTML = '';
        const searchResult = JSON.parse(xmlHttp.responseText)['data'];
        console.log(searchResult);
        songList.style.display = 'block';
        lyrics.style.display = 'none';
        for (let i = 0; i < searchResult.length; i++) {
          const artist = searchResult[i].artist.name;
          const title = searchResult[i].title;
          createListElement(artist, title);
        }
      }
    };
    xmlHttp.open('GET', searchUrl.replace('searchQuery', searchQuery), true); // true for asynchronous
    xmlHttp.send(null);
  }
}

function addListAfterKeypress(event) {
  if (inputLength() > 0 && event.which === 13) {
    createListElement();
  }
}

enterButton.addEventListener('click', addListAfterClick);
