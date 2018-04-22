//通过自定义事件实现footer与panel的解耦
var EventCenter = {
    on: function(type,handler){
        $(document).on(type,handler)
    },
    fire: function(type,data){
        $(document).trigger(type,data)
    }
}
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
            EventCenter.fire('select-sort',{
                channelId:$(this).attr('data-sort'),
                channelName:$(this).attr('data-name')
            })
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
            html +='<li class="theme" data-sort='+sort.channel_id+' data-name='+sort.name+'>'+
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

// panel 功能实现
var panel = {
    init: function(){
        this.channelId = 'public_tuijian_spring'
        this.channelName ='漫步春天'
        this.$panel = $('.page-panel')
        this.audio = new Audio()
        this.audio.autoplay = true
        this.clock = null
        this.lyricObj = {}
        this.bind()
    },
    bind: function(){
        var _this = this
        var clock
        EventCenter.on('select-sort',function(e,channel){
           _this.channelTd = channel.channelId
           _this.channelName = channel.channelName
           _this.getData()
        })
        this.$panel.find('.btn-play').on('click',function(){
            if($(this).hasClass('icon-pause')){
                $(this).removeClass('icon-pause').addClass('icon-play')
                _this.audio.pause()
            }else{
                $(this).removeClass('icon-play').addClass('icon-pause')
                _this.audio.play()
            }
        })
        this.$panel.find('.btn-next').on('click',function(){
            _this.getData()
        })
        this.audio.onplay = function(){
            _this.update()
        }
        this.audio.onpause = function(){
            clearInterval(_this.clock)
        }
        this.audio.onended = function(){
            _this.getData()  
        } 
    },
    getData: function(){
        var _this = this
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php',{channel:this.channelId})
         .done(function(ret){
             console.log('loadmusic...',ret.song[0])
             _this.render(ret.song[0])      
         }).fail(function(){
             console.log('error...')
         })
         
    },
    render: function(song){ 
        this.$panel.find('.aside .control .btn-play').addClass('icon-pause').removeClass('icon-play')   
        this.$panel.find('.aside figure').css('background-image','url('+song.picture+')')
        this.$panel.find('.msg .title').text(song.title)
        this.$panel.find('.msg .author').text(song.artist)
        this.$panel.find('.msg .tag').text(this.channelName)
        $('.bg').css('background-image','url('+song.picture+')')
        this.audio.src = song.url  
        this.loadLyric(song) 
    },
    update: function(){
        var _this = this
        this.clock = setInterval(function(){
            var sec = parseInt(_this.audio.currentTime%60)+''
            var min = parseInt(_this.audio.currentTime/60)+''
            sec = (sec.length<2)?('0'+sec):sec
            $('.timebar .time').text(min +':'+ sec) 
            $('.prograss').css({
                'width':(_this.audio.currentTime/_this.audio.duration)*100 + '%'
            })
            var line = _this.lyricObj['0'+ min +':'+ sec]
            if(line){
                _this.$panel.find('.lyric').text(line)
            }
        },1000)
    },
    loadLyric: function(song){
        var _this = this   
        $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php',{sid:song.sid})
         .done(function(ret){ 
                var lyricObj = {}         
                ret.lyric.split(/\n/).forEach(function(line){
                var times = line.match(/\d{2}:\d{2}/g)
                var str = line.replace(/\[.+?\]/g,'') 
                if(Array.isArray(times)){
                    times.forEach(function(time){
                       lyricObj[time] = str
                    })
                }
                _this.lyricObj = lyricObj
            })
           
        }).fail(function(){
            console.log('loadlyric error...')
        })
    }


}
footer.init()
panel.init()
