
$("#signinBtn").click(function(){
  let email = $("input[name='email']").val()
  let password = $("input[name='password']").val()

  let data = {email, password}
  $.post('/signin', data, function(resData){
    // 登录成功
    if(resData.result){
      window.location.href = '/'
    }
    else{
      alertPopBox('提示', resData.message, 'sm')
    }
  })
})