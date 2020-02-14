
function createProduct(){
  showPopBox('新建产品', `
    <form id='pop-form' action='/newProduct' method='POST'>
      <div class='pop-input-group'>
        <label>产品名称</label>
        <input type='text' name='name'>
      </div>
      <div class='pop-input-group'>
        <label>产品介绍</label>
        <textarea rows="15" name="description"></textarea>
      </div>
      <div class='pop-input-group'>
        <label>产品收费</label>
        <input type='text' name='cost'>
      </div>
      <div class='pop-input-group'>
        <label>产品阶段</label>
        <select name='status'>
          <option value='1'>销售阶段</option>
          <option value='2'>研发阶段</option>
          <option value='3'>创新产品</option>
        </select>
      </div>
      <button>确定新增</button>
    </form>
  `, 'md', 'top')
}

function showPage(node, btn){
  $(".btns > .btn").removeClass('btnSeleted')
  $(btn).addClass('btnSeleted')
  $('.pageMain').css('display', 'none')

  $(node).css('display', 'flex')
}

function editProduct(id){
  $.post('/getProduct', {id: id}, function(res){
    console.log(res)
    showPopBox('编辑', `
      <form id='pop-form' action='/changeProduct' method='POST'>
        <div style="display: none" class='pop-input-group'>
          <label>产品名称</label>
          <input type='text' name='id' value='${res._id}'>
        </div>
        <div class='pop-input-group'>
          <label>产品名称</label>
          <input type='text' name='name' value='${res.name}'>
        </div>
        <div class='pop-input-group'>
          <label>产品介绍</label>
          <textarea rows="15" name="description">${res.description}</textarea>
        </div>
        <div class='pop-input-group'>
          <label>产品收费</label>
          <input type='text' name='cost' value='${res.cost}'>
        </div>
        <div class='pop-input-group'>
          <label>产品阶段</label>
          <select name='status'>
            <option value='1' ${res.status == 1?'selected':''}>销售阶段</option>
            <option value='2' ${res.status == 2?'selected':''}>研发阶段</option>
            <option value='3' ${res.status == 3?'selected':''}>创新产品</option>
          </select>
        </div>
        <button>确定修改</button>
      </form>
    `, 'md', 'top')
  })
  
}

$(".btns > .btn").first().click()