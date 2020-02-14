
$(".description").click()

function showCreateCustomer(){
  showPopBox('新建客户', `
    <form id='pop-form' action='/customer/newCustomer' method='POST'>
      <div class='pop-input-group'>
        <label>公司名称</label>
        <input type='text' name='name'>
      </div>
      <div class='pop-input-group'>
        <label>背景介绍</label>
        <textarea rows="15" name="description"></textarea>
      </div>
      <button>确定新建</button>
    </form>
  `, 'md', 'top')
}

function showPage(node, btn){
  $(".btns > .btn").removeClass('btnSeleted')
  $(btn).addClass('btnSeleted')
  $('.pageMain').css('display', 'none')

  $(node).css('display', 'flex')
}

$(".btns > .btn").first().click()
