
function toggleCreateUserModal(){
  $('.createUserModal').toggle()
}

function showEditUserModal(id){
  $.post('/signin/getUserInfoById', {id}, res=>{
    $('.editUserModal .idInput').val('')
    $('.editUserModal .nameInput').val('')
    $('.editUserModal .jobInput').val('')
    $('.editUserModal .telephoneInput').val('')
    $('.editUserModal .emailInput').val('')
    $('.editUserModal .loginNameInput').val('')
    $('.editUserModal .avatarInput').val('')
    $('.editUserModal .introductionInput').val('')
    $('.editUserModal .avatar').attr('src', '/img/user.jpeg')

    $('.editUserModal .idInput').val(res._id)
    $('.editUserModal .nameInput').val(res.name)
    $('.editUserModal .jobInput').val(res.job)
    $('.editUserModal .telephoneInput').val(res.telephone)
    $('.editUserModal .emailInput').val(res.email)
    $('.editUserModal .loginNameInput').val(res.loginName)
    $('.editUserModal .avatarInput').val(res.avatar)
    $('.editUserModal .introductionInput').val(res.introduction)
    $('.editUserModal .avatar').attr('src', res.avatar)

    $('.editUserModal').toggle()
  })
}

function hideEditUserModal(){
  $('.editUserModal').toggle()
}

$(".createUserModal #avatarInput").change(()=>{
  var file = $(".createUserModal #avatarInput")[0].files[0];
  
  if(file.size > 30000){
    alertPopBox('提示', `文件大小应小于25k`, 'md')
    return
  }
  //创建读取文件的对象
  var reader = new FileReader();

  //为文件读取成功设置事件
  reader.onload = function(e){
      var imgFile;

      imgFile = e.target.result;
      $(".createUserModal .avatarInput").val(imgFile)
      $(".createUserModal .avatar").attr('src', imgFile);
  };

  //读取文件
  reader.readAsDataURL(file);
})

$(".editUserModal #avatarInput").change(()=>{
  var file = $(".editUserModal #avatarInput")[0].files[0];
  
  if(file.size > 30000){
    alertPopBox('提示', `文件大小应小于25k`, 'md')
    return
  }
  //创建读取文件的对象
  var reader = new FileReader();

  //为文件读取成功设置事件
  reader.onload = function(e){
      var imgFile;

      imgFile = e.target.result;
      $(".editUserModal .avatarInput").val(imgFile)
      $(".editUserModal .avatar").attr('src', imgFile);
  };

  //读取文件
  reader.readAsDataURL(file);
})

function createUser(){
  var formData = $('.createUserModal .container').serializeArray(), data = {};

  for(let item of formData){
    data[item.name] = item.value
  }

  $.post('/signin/createUser', data, res=>{
    console.log(res)
    if(res.result){
      alertPopBox('提示', res.message, 'sm')
      setTimeout(()=>{
        location.reload()
      }, 1200)
    }
  })
}

function changeUser(){
  var formData = $('.editUserModal .container').serializeArray(), data = {};

  for(let item of formData){
    data[item.name] = item.value
  }

  $.post('/signin/changeUserInfoById', data, res=>{
    console.log(res)
    if(res.result){
      alertPopBox('提示', res.message, 'sm')
      setTimeout(()=>{
        location.reload()
      }, 1200)
    }
  })
}

function deleteUser(){
  var id = $('.editUserModal .idInput').val()

  $.post('/signin/deleteUserById', {id}, res=>{
    console.log(res)
    if(res.result){
      alertPopBox('提示', res.message, 'sm')
      setTimeout(()=>{
        location.reload()
      }, 1200)
    }
  })
}