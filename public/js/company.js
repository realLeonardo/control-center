/**
 * Company
 * @author mufeng
 * @since 2018-09-10
 */

sites.forEach(function (site) {
  const url = site.url
  const $elem = $(`
<div class="company company-${site._id}" style="padding-bottom: 30px; margin-bottom: 30px; border-bottom: 1px solid #ccc">
  <h3>${site.name}</h3>
  <div class="row">
    <div class="col-md-4">
      <img src="${site.wxcode}" width="150" height="150" />
    </div>
    <div class="col-md-8"></div>
  </div>
</div>
  `)

  $('.companyContainer').append($elem)

  if (!site.wxcode) {
    fetchWXCode(site._id, url, (res) => {
      $(`.company-${site._id} img`).attr('src', res.wxcode)
    })
  }

  fetchJobList(url, function (data) {
    $(`.company-${site._id} h3`).text(data.name)
    $(`.company-${site._id} .col-md-8`).text(data.offerJobs.map(job => job.name).join(' 、 '))
  })
})

function fetchJobList (url, callback) {
  $.ajax({
    url: `${url}/api/wechatMpResume`,
    success: function (res) {
      callback(res.data)
    },
    error: function (err) {
    }
  })
}

function fetchWXCode (id, url, callback) {
  const port = url.split(':')[2]

  $.ajax({
    url: `/api/wxcode?id=${id}&port=${port}`,
    success: function (res) {
      callback(res.wxcode)
    },
    error: function (err) {
    }
  })
}
