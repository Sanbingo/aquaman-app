import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'


export default class Article extends Component {
    config: Config = {
        navigationBarTitleText: '文章详情'
      }
    constructor () {
        super(...arguments)
        this.state = {
          title: '',
          time: '',
          author: '',
          content: ''
        }
      }
    componentWillMount () {
    console.log('isFetching: ', this.isFetching)
    this.$preloadData
        .then(res => {
        console.log('res: ', res)
        this.setState({
            title: res && res.data && res.data.title.rendered,
            time: res && res.data && res.data.modified,
            content: res && res.data && res.data.content.rendered,
        })
        this.isFetching = false
        Taro.hideLoading()
        })
    }

    componentWillPreload (params) {
        console.log('params', params)
        return this.fetchData(params.id)
    }

    fetchData (id) {
        this.isFetching = true
        Taro.showLoading()
        return Taro.request({
            url: `http://47.110.230.32/wp-json/wp/v2/posts/${id}`, 
          })
    }
    render() {
        return (
            <View className='at-article'>
                <View className='at-article__h1'>
                    {this.state.title || '这是一级标题这是一级标题'}
                </View>
                <View className='at-article__info'>
                    {this.state.time || '2017-05-07'}
                </View>
                <View className='at-article__content'>
                    <View className='at-article__section'>
                        <View className='at-article__p'>
                            <RichText nodes={this.state.content} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}