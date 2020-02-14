

function editCustomerInfo(id, cid){
  $.post('/customer/getCustomerInfo', {id}, function(res){
    let customerInfo = res.customer
    let cooperators = '', products = '', others = ''
    
    for(let user of res.users){
      if(cid == user._id){

      }
      else if(customerInfo.cooperators.indexOf(user._id)  >= 0){
        cooperators += `
          <label>
            <input type="checkbox" name="cooperators" value="${user._id}" checked />
            <span>${user.name}</span>
          </label>
        `
      }
      else{
        cooperators += `
          <label>
            <input type="checkbox" name="cooperators" value="${user._id}" />
            <span>${user.name}</span>
          </label>
        `
      }
    }

    for(let product of res.products){
      if(customerInfo.products.indexOf(product._id) >= 0){
        products += `
          <label>
            <input type="checkbox" name="products" value="${product._id}" checked />
            <span>${product.name}</span>
          </label>
        `
      }
      else{
        products += `
          <label>
            <input type="checkbox" name="products" value="${product._id}" />
            <span>${product.name}</span>
          </label>
        `
      }
    }

    if(customerInfo.status == 5){
      if(customerInfo.contract){
        others += `
          <div class='pop-input-group other-input'>
            <label>合同周期</label>
            <div>
              <input type="date" name="contract.begin" value="${customerInfo.contract.begin?(new Date(customerInfo.contract.begin)).format('yyyy-MM-dd'):''}">
              <span>至</span>
              <input type="date" name="contract.end" value="${customerInfo.contract.end?(new Date(customerInfo.contract.end)).format('yyyy-MM-dd'):''}">
            </div>
          </div>
        `
      }
      else{
        others += `
          <div class='pop-input-group other-input'>
            <label>合同周期</label>
            <div>
              <input type="date" name="contract.begin" value="">
              <span>至</span>
              <input type="date" name="contract.end" value="">
            </div>
          </div>
        `
      }

      if(customerInfo.monthCost){
        others += `
          <div class='pop-input-group other-input'>
            <label>每月金额</label>
            <div>
              <input type="number" name="monthCost" value="${customerInfo.monthCost}">
              <span>元/每月</span>
            </div>
          </div>
        `
      }
      else{
        others += `
          <div class='pop-input-group other-input'>
            <label>每月金额</label>
            <div>
              <input type="number" name="monthCost" value="">
              <span>元/每月</span>
            </div>
          </div>
        `
      }
    }
    else{
      others += `
        <div class='pop-input-group other-input' style="display: none">
          <label>合同周期</label>
          <div>
            <input type="date" name="contract.begin" value="">
            <span>至</span>
            <input type="date" name="contract.end" value="">
          </div>
        </div>
      `
      others += `
        <div class='pop-input-group other-input' style="display: none">
          <label>每月金额</label>
          <div>
            <input type="number" name="monthCost" value="">
            <span>元/每月</span>
          </div>
        </div>
      `
    }

    showPopBox('编辑公司信息', `
      <form id='pop-form' action='/customer/changeCustomerInfo' method='POST'>
        <input style="display: none" type='text' name='id' value='${customerInfo._id}'>
        <div class='pop-input-group'>
          <label>公司名称</label>
          <input type='text' name='name' value='${customerInfo.name}'>
        </div>
        <div class='pop-input-group'>
          <label>背景介绍</label>
          <textarea rows="15" name="description">${customerInfo.description}</textarea>
        </div>
        <div class='pop-input-group'>
          <label>协助人员</label>
          <div class='checkbox-group'>
          ${cooperators}
          </div>
        </div>
        <div class='pop-input-group'>
          <label>关联产品</label>
          <div class='checkbox-group'>
          ${products}
          </div>
        </div>
        <div class='pop-input-group'>
          <label>客户阶段</label>
          <select name='status' onchange="selectChange(this)">
            <option value='0' ${customerInfo.status == 0?'selected':''}>新建</option>
            <option value='1' ${customerInfo.status == 1?'selected':''}>需求沟通</option>
            <option value='2' ${customerInfo.status == 2?'selected':''}>服务方案</option>
            <option value='3' ${customerInfo.status == 3?'selected':''}>合同审批</option>
            <option value='4' ${customerInfo.status == 4?'selected':''}>签约打款</option>
            <option value='5' ${customerInfo.status == 5?'selected':''}>服务中</option>
            <option value='6' ${customerInfo.status == 6?'selected':''}>合作取消</option>
          </select>
        </div>
        ${others}
        <button>确定修改</button>
      </form>
    `, 'md', 'top')
  })
}

function selectChange(node){
  if($(node).val() == 5){
    $(".other-input").css('display', 'flex')
  }
  else{
    $(".other-input").css('display', 'none')
  }
}

function editCompanyInfo(id){
  $.post('/customer/getCustomerInfo', {id}, function(res){
    if(res.customer.companyInfo){
      let companyInfo = res.customer.companyInfo
      showPopBox('编辑公司信息', `
        <form id='pop-form' action='/customer/changeCompanyInfo' method='POST'>
          <input style="display: none" type='text' name='id' value='${res.customer._id}'>
          <div class='pop-input-group'>
            <label>公司官网</label>
            <input type='text' name='companyInfo.website' value='${companyInfo.website}'>
          </div>
          <div class='pop-input-group'>
            <label>公司地址</label>
            <input type='text' name='companyInfo.address' value='${companyInfo.address}'>
          </div>
          <div class='pop-input-group'>
            <label>主营产品</label>
            <input type='text' name='companyInfo.products' value='${companyInfo.products}'>
          </div>
          <div class='pop-input-group'>
            <label>联系人</label>
            <input type='text' name='companyInfo.contact' value='${companyInfo.contact}'>
          </div>
          <div class='pop-input-group'>
            <label>联系电话</label>
            <input type='text' name='companyInfo.telephone' value='${companyInfo.telephone}'>
          </div>
          <div class='pop-input-group'>
            <label>公司介绍</label>
            <textarea rows="15" name="companyInfo.introduction">${companyInfo.introduction}</textarea>
          </div>
          <button>确定修改</button>
        </form>
      `, 'md', 'top')
    }
    else{
      showPopBox('编辑公司信息', `
        <form id='pop-form' action='/customer/changeCompanyInfo' method='POST'>
          <input style="display: none" type='text' name='id' value='${res.customer._id}'>
          <div class='pop-input-group'>
            <label>公司官网</label>
            <input type='text' name='companyInfo.website' value=''>
          </div>
          <div class='pop-input-group'>
            <label>公司地址</label>
            <input type='text' name='companyInfo.address' value=''>
          </div>
          <div class='pop-input-group'>
            <label>主营产品</label>
            <input type='text' name='companyInfo.products' value=''>
          </div>
          <div class='pop-input-group'>
            <label>联系人员</label>
            <input type='text' name='companyInfo.contact' value=''>
          </div>
          <div class='pop-input-group'>
            <label>联系电话</label>
            <input type='text' name='companyInfo.telephone' value=''>
          </div>
          <div class='pop-input-group'>
            <label>公司介绍</label>
            <textarea rows="15" name="companyInfo.introduction"></textarea>
          </div>
          <button>确定修改</button>
        </form>
      `, 'md', 'top')
    }
  })
}

function showDeleteWord(cid, wid){
  showPopBox('提示', `
    <button class="danger-btn" onclick="deleteWord('${cid}', '${wid}')">确定删除</button>
  `, 'sm', 'top')
}

function deleteWord(cid, wid) {
  $.post('/customer/deleteWord', {cid, wid}, function(res){
    location.reload()
  })
}

Date.prototype.format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "H+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}