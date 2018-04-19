// footer功能实现
var footer = {
    init: function(){
        this.$ul = $('footer ul')
        this.$leftBtn = $('footer .icon-left')
        this.$rightBtn = $('footer .icon-right')
        this.isAnimate = false
        this.toStart = true
        this.toEnd = false
        this.setData()
        this.bind()
    },
    bind: function(){
        var _this=this
        var itemWidth = $('footer ul').find('li').outerWidth(true)
        var moveCount = Math.floor($('footer .container').width()/itemWidth)
        var moveLength = moveCount *itemWidth
        this.$leftBtn.on('click',function(){
            if(_this.isAnimate) return
            if(!_this.toStart){
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '+='+ moveLength,
                },400,function(){
                    _this.isAnimate = false
                    _this.toEnd = false
                    if(parseFloat(_this.$ul.css('left'))>=0){
                        _this.toStart = true
                    }   
                })
            }
        })
        this.$rightBtn.on('click',function(){
            if(_this.isAnimate) return
            if(!_this.toEnd){
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '-='+ moveLength,
                },400,function(){
                    _this.isAnimate = false
                    _this.toStart = false
                    if(parseFloat(_this.$ul.css('left'))+parseFloat(_this.$ul.width())<=parseFloat($('footer .container').width())){
                        _this.toEnd = true
                    }
                })
            }
        })
        this.$ul.on('click','li',function(){
            $(this).addClass('active')
                   .siblings().removeClass('active')
            
        })
    },
    setData: function(){
        var _this=this
        $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php')
         .done(function(ret){
            console.log(ret)
            _this.render(ret.channels)
         }).fail(function(){
            console.log('error...')
         })
    },
    render: function(musicSorts){
        var html = ''
        musicSorts.forEach(function(sort){
            html +='<li class="theme" data-sort='+sort.channel_id+'>'+
                        '<figure style="background-image:url('+sort.cover_small+')"></figure>'+
                        '<h4>'+sort.name+'</h4>'+
                   '</li>'
        })
        this.$ul.html(html)
        this.setStyle()
    },
    setStyle: function(){
        var _this=this
        var itemWidth = $('footer ul').find('li').outerWidth(true)
        var count = $('footer ul').find('li').length
        this.$ul.css({
            "width": itemWidth*count + "px"
        })
    }
}
var panel = {
    init: function(){
        this.bind()
    },
    bind: function(){

    },
    getData: function(){

    },
    render: function(){

    }

}
footer.init()
panel.init()
