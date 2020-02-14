
function createSite(){
  showPopBox('新增ATS', `
    <form id='pop-form' action='/site/createSite' method='POST'>
      <div class='pop-input-group'>
        <label>公司名称</label>
        <input type='text' name='name' placeholder="必填" required>
      </div>
      <div class='pop-input-group'>
        <label>管理员邮箱</label>
        <input type='text' name='email' value="" placeholder="必填" required>
      </div>
      <div class='pop-input-group'>
        <label>管理员密码</label>
        <input type='text' name='password' value="ruler2019" placeholder="必填" required>
      </div>
      <div class='pop-input-group'>
        <label>类型</label>
        <select name="kind">
          <option value="1">公共</option>
          <option value="0">私有</option>
        </select>
      </div>
      <button>确定新增</button>
    </form>
  `, 'md', 'top')
}

function editSite(id){
  $.post('/site/getSiteInfoById', {id})
  .then(res=>{
    console.log(res)
    showPopBox('编辑ATS', `
      <form id='pop-form' action='/site/changeSiteInfoById' method='POST'>
        <input style="display: none" type='text' name='id' value="${id}">
        <div class='pop-input-group'>
          <label>公司名称</label>
          <input type='text' name='name' value="${res.data.name}">
        </div>
        <div class='pop-input-group'>
          <label>类型</label>
          <select name="kind">
            <option value="1" ${res.data.kind==1?'selected':''}>公共</option>
            <option value="0" ${res.data.kind==0?'selected':''}>私有</option>
          </select>
        </div>
        <div class='pop-input-group'>
          <label>数据库名称</label>
          <input type='text' name='dbName' value="${res.data.dbName|| ''}" readonly>
        </div>
        <div class='pop-input-group'>
          <label>管理员邮箱</label>
          <input type='text' name='admin.email' value="${(res.data.admin)?res.data.admin.email || '':''}" readonly>
        </div>
        <div class='pop-input-group'>
          <label>管理员密码</label>
          <input type='text' name='admin.password' value="${(res.data.admin)?res.data.admin.password || '' : ''}" readonly>
        </div>

        <button>确定修改</button>
      </form>
    `, 'md', 'top')

  })
}

function restart(fileName) {
  showPopBox('重启网站', `
    <form id='pop-form' action='/site/restart' method='POST'>
      <input name="fileName" value="${fileName}" type="hidden"/>
      <button>确定重启</button>
    </form>
  `, 'md', 'top')
}

function stop(fileName) {
  showPopBox('关闭网站', `
    <form id='pop-form' action='/site/stop' method='POST'>
      <input name="fileName" value="${fileName}" type="hidden"/>
      <button>确定关闭</button>
    </form>
  `, 'md', 'top')
}

$(".icon").hover(function(){
  $(this).prev().show()
}, function(){
  // $(this).prev().toggle()
})

$(".siteInfo").hover(function(){
  $(this).show()
}, function(){
  $(this).hide()
})
