import Taro, { Component, Config, useReachBottom} from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtTabBar, AtDivider } from 'taro-ui'
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
    navigationBarTitleText: '首页',
    onReachBottomDistance: 350,
  }
  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      list: [],
      page: 1,
      per_page: 20
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  getPosts() {
    Taro.request({
      url: 'http://47.110.230.32/wp-json/wp/v2/posts', 
      data: {
        page: this.state.page,
        per_page: this.state.per_page
      }
    }).then(res => {
      this.setState({
        list: [...this.state.list, ...res.data],
        page: this.state.page + 1
      })
    })
  }
  componentWillMount () {
    this.getPosts();
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

  renderSwiper() {
    return (
      <Swiper
        className='test-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <View className='demo-text-1'><Image
          src='http://b.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg'
        /></View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-2'><Image src='http://a.hiphotos.baidu.com/image/pic/item/9a504fc2d5628535bdaac29e9aef76c6a6ef63c2.jpg' /></View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-3'><Image src='http://f.hiphotos.baidu.com/image/pic/item/b151f8198618367aa7f3cc7424738bd4b31ce525.jpg' /></View>
        </SwiperItem>
      </Swiper>
    )
  }
  renderList() {
    const imgReg = /<img.*?(?:>|\/>)/gi
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i

    return this.state.list.map(item => {
      // 从content中提取第一张图片为缩略图
      const arr = item.content.rendered.match(imgReg);
      const src = arr && arr[0] && arr[0].match(srcReg);
      return <List key={item.id} thumb={src && src[1]} title={item.title.rendered} time={item.modified} />
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
          {this.renderSwiper()}
          {this.renderList()}
          {this.rednerBottomLine()}
        </View>
        <AtTabBar
        fixed
        tabList={[
          { title: '待办事项', iconType: 'bullet-list', text: 'new' },
          { title: '拍照', iconType: 'camera' },
          { title: '文件夹', iconType: 'folder', text: '100', max: '99' }
        ]}
        onClick={this.handleClick.bind(this)}
        current={this.state.current}
      />
      </View>
    )
  }
}
