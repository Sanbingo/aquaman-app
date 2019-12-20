import Taro, { Component, Config} from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, Text, ScrollView } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import List from './components/list'
import './index.less'

const MAX_REQUEST_PAGES = 5;

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '8小时资讯',
    onReachBottomDistance: 350,
  }
  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      list: [],
      categories: [{
        id: 9999,
        name: '首页'
      }],
      sp: [],
      page: 1,
      per_page: 20,
      tabsIdx: 9999
    }
  }
  getPosts() {
    const { page, per_page, tabsIdx, list} = this.state
    const postData = {
      page,
      per_page
    }
    if (tabsIdx !== 9999) {
      postData.categories = tabsIdx
    }
    Taro.showToast({
      icon: 'none',
      title: 'loading...'
    })
    Taro.request({
      url: 'https://www.8hnews.com/wp-json/wp/v2/posts', 
      data: postData
    }).then(res => {
      this.setState({
        list: page === 1? res.data : [...list, ...res.data],
        page: page + 1
      })
      Taro.hideToast()
    })
  }
  getCategories() {
    Taro.request({
      url: 'https://www.8hnews.com/wp-json/wp/v2/categories'
    }).then(res => {
      this.setState({
        categories: [...this.state.categories, ...res.data],
      })
    })
  }
  getSpecialPosts() {
    Taro.request({
      url: 'https://www.8hnews.com/wp-json/wp/v2/posts?author=6'
    }).then(res => {
      this.setState({
        sp: res.data.slice(0, 5)
      })
    })
  }
  componentWillMount () {
    this.getPosts();
    this.getCategories();
    this.getSpecialPosts();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom() {
    if (this.state.page > MAX_REQUEST_PAGES) {
      // 最多只允许翻5页
      return
    } 
    this.getPosts()
  }

  processList(list) {
    // 收集content中图片的信息
    const imgReg = /<img.*?(?:>|\/>)/gi
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
    return list.map((item, index) => {
      const arr = item.content.rendered.match(imgReg) || [];
      const srcMatch = arr && arr[0] && arr[0].match(srcReg)    
      return ({
        ...item,
        includePics: arr.length > 0, // 文章是否包含图片
        picsCount: arr.length, // 文章中图片的数量
        firstPic: srcMatch && srcMatch[1], // 首图地址
      })
    })
  }

  handleTabsClick = id => () => {
    this.setState({
      tabsIdx: id,
      page: 1,
      per_page: 20,
    }, () => {
      this.getPosts()
    })
  }
  renderTabs() {
    const { tabsIdx, categories } = this.state
    return (
      <ScrollView className="tabs-container" scrollX>
        {categories.map((item, index) => <Text key={item.id}
        className={ item.id === tabsIdx ? 'tabs-container__item checked' : 'tabs-container__item'}
        onClick={this.handleTabsClick(item.id)}
        >{item.name}</Text>)}
      </ScrollView>
    )
  }
  handleClick = (id) => () => {
    Taro.navigateTo({
        url: `/pages/article/index?id=${id}`
      })
  }
  renderSwiper() {
    const { sp } = this.state
    return (
      <Swiper
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay>
          {
            this.processList(sp).filter(item => item.includePics).map(item => <SwiperItem
              onClick={this.handleClick(item.id)}
              key={item.id}>
              <Image style='width: 100%'
              src={item.firstPic}
            />
            </SwiperItem>)
          }
      </Swiper>
    )
  }
  renderList() { 
    return this.processList(this.state.list).filter(item => item.includePics).map((item, index) => {
      return <List key={item.id} postId={item.id} thumb={item.firstPic} title={item.title.rendered} time={item.modified} />
    })
  }
  rednerBottomLine() {
    const { page } = this.state
    if (page > MAX_REQUEST_PAGES) {
      // 最多只允许翻5页
      return <AtDivider content='我们是有底线的！' fontColor='#ccc'/>
    } 
  }
  render () {
    return (
      <View className='index'>
        <View className='lists-container'>
          {this.renderTabs()}
          {this.renderSwiper()}
          {this.renderList()}
          {this.rednerBottomLine()}
        </View>
      </View>
    )
  }
}
