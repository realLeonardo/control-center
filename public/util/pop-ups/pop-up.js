// 弹窗API
// 日期： 2018/8/6 16:00

class Pop_up{

}

function alertPopBox(title='', content='', size='md', position='top', time=1500){
  let container = document.querySelector('body > div#boxContainer')

  if(container){
    updatePopBox(title, content, size, position)
  }
  else{
    createPopBox(title, content, size, position)
  }
  container = document.querySelector('body > div#boxContainer')
  container.style.display = 'flex'

  setTimeout(function(){
    container.style.display = 'none'
  }, time)
}

function showPopBox(title='', content='', size='md', position='top'){
  let container = document.querySelector('body > div#boxContainer')
  if(container){
    container.style.display = 'flex'
    updatePopBox(title, content, size, position)
  }
  else{
    createPopBox(title, content, size, position)
  }
}

function hidePopBox(){
  document.querySelector('body > div#boxContainer').style.display = 'none'
}

function createPopBox(title='', content='', size='md', position='mid'){
  let body = document.querySelector('body')
  let container = document.createElement('div')

  container.id = 'boxContainer'
  container.addEventListener('click', function(e){
    hidePopBox()
  })
  
  container.innerHTML = `
    <div class='box ${size} ${position}'>
      <div class='boxHeader'>
        <span class='title'>${title}</span>
        <button onclick='hidePopBox()'>关闭</button>
      </div>
      <div class='boxMain'>
        ${content}
      </div>
    </div>
  `

  body.appendChild(container)

  document.querySelector('body > div#boxContainer > div.box').addEventListener('click', function(e){
    e.stopPropagation()
  })

}

function updatePopBox(title='', content='', size='md', position='mid'){
  document.querySelector('body > div#boxContainer > div.box').className = `box ${size} ${position}`
  document.querySelector('body > div#boxContainer > div.box > div.boxHeader > .title').innerHTML = title
  document.querySelector('body > div#boxContainer > div.box > div.boxMain').innerHTML = content
}