import '@/css/info.less'
import Tabs from '@/components/tabs'
import '@/css/articlelist.less'
import PageList from '@/components/page-list'
// import PullList from '@/components/pull-list'
// import Loading from '@/components/loading'
// import isMobile from '@/utils/isMobile'
import Api from '@/utils/api'
import $ from 'jquery'
new Tabs({
  el: '.main-interdebox-interde-contbox-cont-left',
  defaultActive: 1
})
window.page_list = []
function page (el, pageel, type) {
  let baseConfig = {
    listConfig: {
      container: el,
      template (data) {
        return `<div class="hbd-articleLists">
        <div class="hbd-cardBox" id="hbd-cardBox">
                <div class="hbd-card1">
                    <div class="hbd-card1-left">
                        <!-- img -->
                      <a href="/channelarticledetail/${data.id}?${type}" class="set">
                        <img class="hbd-card1-left_img" src="${data.titleImg}" alt="">
                        </a>
                        <!-- END img -->
                    </div>
                    <div class="hbd-card1-content">
                        <div class="hbd-card1-content-head verticalCenter">${data.title}
                            <div class="hbd-card1-content-head_time textRight">2018 6-5</div>
                        </div>
                        <div class="hbd-card1-content-describe textLeft">
                                ${data.description}
                        </div>
                        <div class="hbd-card1-content-detail verticalCenter">
                            <div class="hbd-card1-content-detail-experts">
                                ${data.articleDate.slice(0, 10)}
                            </div>
                            <div class="hbd-card1-content-detail-experts-cont textRight main-sharebox-like"><i class="iconfont icon-z-like"></i> <span> 点赞 </span></div>
                        </div>
                    </div>
                </div>
        </div>
      </div>`
      }
    },
    //  ${data.articleDate.slice(0, 10)} /likearticle/${data.id}
    api: Api.infoPageList,
    onSuccess (res) {
      let items = res.results.items.map(item => {
        let title = item.title
        return { ...item,
          title
        }
      })
      res.results.items = items
      return res
    },
    onError (err) {
      console.log(err)
      console.log('请求出错了')
    },
    onInit () {},
    onStop () {
      this.$loading.dataless('没有更多了')
    }
  }
  let pcConfig = {
    ...baseConfig,
    pageConfig: {
      ele: pageel,
      cur: 1,
      limit: 10,
      total: 1000
    },
    debounceTime: 500
  }
  window.page_list.push(new PageList(pcConfig))
  // window.page_list.push =new PageList(pcConfig)

}
$(async function () {
  let config = {
    '?news': {id: 43},
    '?character': {id: 39631},
    '?hotspot': {id: 8928},
    '?relation': {id: 7972},
    '?manage': {id: 444},
    '?scholarship': {id: 3380}
  }
  let url = this.location.search
  const res = await Api.infoPageList(config[url])
  config.map((index, item) => {
    window.page_list[index].pageChangeToDo(1, res)
  })
})
// 分页1
page('#bottom-list', '#bottomPagination', 'news')
// 分页2
page('#bottom-list2', '#bottomPagination2', 'character')
// // 分页3
page('#bottom-list3', '#bottomPagination3', 'hotspot')
// // 分页4
page('#bottom-list4', '#bottomPagination4', 'relation')
// // 分页5
page('#bottom-list5', '#bottomPagination5', 'manage')
// // 分页6
page('#bottom-list6', '#bottomPagination6', 'scholarship')

$('#focus input').on('focus', function () {
  $('#focus').addClass('focus').removeClass('blur')
})
$('#focus input').on('blur', function () {
  $('#focus').addClass('blur').removeClass('focus')
})

// 点赞  .getAttribute('href') firstElementChild
$('.hbd-list_content').on('click', function (e) {
  var ev = e || event
  var target = ev.target || ev.srcElement
  const id = target.parentNode.parentNode.parentNode.previousElementSibling.querySelector('.set').getAttribute('href')
  // console.log(id)
  const newid = id.replace(/[^0-9]/ig, '')
  Api.likearticle({id: newid}).then((res) => {})
  // console.log(newid)
  if (target.nodeName.toLowerCase() === 'span') {
    target.innerHTML = '已点赞'
    target.parentElement.parentElement.className += ' ' + 'active-like'
  }
})

