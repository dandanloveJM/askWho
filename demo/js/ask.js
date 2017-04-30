    "use strict"
 //初始化AV
    const appId = 'YoUKvGrpeG6iQlrkqeTqrgQU-gzGzoHsz';
    const appKey = 'rvYorKtJCDBTL5bmbiINj99c';
    const region = 'cn';
    
    AV.init({ appId, appKey, region });

    

    /*判断是否登录*/
    var currentUser = AV.User.current()
    if(currentUser){
        var currentUserID = AV.User.current().id
        var user = AV.Object.createWithoutData('_User', currentUserID);
        user.fetch().then(function () {
            var realName = user.get('realName');// 读取realName是异步的
            console.log(realName)
            var loginListContent = `
            <a href="selfCenter.html" class="first corner selfCenter">我的个人中心</a>
            <a href="#" class="corner log-out">退出登陆</a>
            
            `
            $('.login-list').append(loginListContent)
            console.log(currentUserID)

              /*点击提交问题时，先从页面上获取数据，再存入数据库*/
            $('#submit-btn').on('click', function(e){
                console.log(1)
                e.preventDefault()
                
                let rewardNum = 0
                let tagsArray = []
                let questionTitle = $('#title-area').val()
                let questionContent = $('#content-area').val()
                let time = ''

            

                
                let nowTime = new Date()
                let nowMonth = nowTime.getMonth() + 1
                time = nowTime.getFullYear() + '-' + nowMonth + '-' + nowTime.getDate()

                $('.tag-item.selected').each(function(index, element){
                    tagsArray[index] = $(element).text()   
                })

                if($('.reward-icon').hasClass('status-on')){
                    rewardNum = parseInt($('#reward-num').text())
                }

            
                
                //将页面的数据存入Question对象
                newQuestion.set('flag', false)
                newQuestion.set('time', time)
                newQuestion.set('username', realName)
                newQuestion.set('reward', rewardNum)
                newQuestion.set('questionTag', tagsArray)
                newQuestion.set('dependentUser', currentUser)
                newQuestion.set('title', questionTitle)
                newQuestion.set('content', questionContent)
            

                newQuestion.save().then(function(){
                    console.log('已保存')
                    let newQuestionID = newQuestion.id
                    //先检查UserInfo中是否存在当前用户
                    //如果存在就更新数据，如果不存在，就新建UserInfo对象

                    
                    var currentUser = AV.User.current()
                    if(currentUser){
                        var queryForUserInfo = new AV.Query('UserInfo')
                        var currentUserID = AV.User.current().id
                        //找到提问者
                        var Questioner = AV.Object.createWithoutData('_User', currentUserID)
                        queryForUserInfo.equalTo('user',Questioner);
                        // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
                        queryForUserInfo.include('user');
                        queryForUserInfo.find().then(function(result){
                            if(result){//如果已经有该用户,则更新数据
                                result.forEach(function(result){
                                    console.log(result)
                            
                                    //获得原来的数据
                                    let userInfoID = result.id
                                    console.log(userInfoID)
                                    let reasonsArray = result.get('reasonHistory')
                                    console.log(reasonsArray)
                                    let changesArray = result.get('changeHistory')
                                    let fortune = result.get('fortune')
                                    console.log(changesArray)

                                    //更新原来的数据
                                    reasonsArray.push('提出一个问题')
                                    changesArray.push('-'+rewardNum)
                                    fortune = fortune - rewardNum

                                    var UserInfo = AV.Object.createWithoutData('UserInfo', userInfoID)
                                    UserInfo.set('reasonHistory', reasonsArray)
                                    UserInfo.set('changeHistory', changesArray)
                                    UserInfo.set('fortune', fortune)

                                    UserInfo.save().then(function(){
                                        var url = 'questionDetail.html?id='+ newQuestionID
                                        window.location.href = url
                                        console.log('已经存在的已保存')
                                    })

                                })
                                
                                
                            
                            


                            }else{//没有该用户，则新建对象
                                    let UserInfo = AV.Object.extend('UserInfo')
                                    let userInfo = new UserInfo()
                                    userInfo.set('user', Questioner)
                                    userInfo.set('reasonObject', newQuestion)
                                    userInfo.set('username', realName)
                                    userInfo.set('reasonHistory', ['提出一个问题'])
                                    userInfo.set('changeHistory', ['-'+rewardNum])

                                    userInfo.save().then(function(){
                                        var url = 'questionDetail.html?id='+ newQuestionID
                                        window.location.href = url
                                        console.log('之前不存在的也保存了')
                                    })


                            }
                        })

                    }else {
                        alert('请先登陆')
                    }
                
                



                    
                })

            


            })




        }, function (error) {
            // 异常处理
        });
        
       
    }else {
        var pleaseLoginOrRegister = `
            
           <a href="register.html" class="first corner">注册</a>
           <a href="login.html"  class="corner">登录</a>
        `
        $('.login-list').append(pleaseLoginOrRegister)
        //隐藏提问部分，只有登录了才能提问
        $('.question-description').hide()
        let tip = $('<p>请先登录！登录之后才能提问噢！</p>')
        $('.ask-main-box').append(tip)
    }
    
    /*增加标签*/
    /*点击增加标签*/
    $('#add-tag').on('click', function(e){
        e.preventDefault()
        e.stopPropagation()
        $('.dialog').show()
    })
    $('.dialog').on('click', function(e){
        if($(e.target).hasClass('sure')){
            let newTagText = $('#search-tag-input').val()
            if(newTagText){
                let newTag = $('<span></span>').text(newTagText)
                $('.tag-list').append(newTag)
                newTag.addClass('tag-item selected')
            }
            
            $('.dialog').hide()
        }else if($(e.target).hasClass('close')) {
            $('.dialog').hide()

        }else {
            e.stopPropagation()
        }
    })
    /*点击一次标签，被选中，再点，不被选中*/
    $('.tag-list').on('click', function(e){
        if(e.target.tagName.toLowerCase() === 'span'){
            $(e.target).toggleClass('selected')
        }

    })
  
    /*点击其他地方，窗口会关闭*/
    $(window).on('click', function(){
        $('.dialog').hide()
    })

    /*点击补充问题*/
    var supplyCount = 0
    $('.supply-qd-btn').on('click', function(e){
        supplyCount++
        if(supplyCount%2==1){
            $('.qd-desc').show()
            $('#moreQuestion').text('收起问题')
        }else {
            $('.qd-desc').hide()
        }
        

    })
   
    /*点击要悬赏*/
    var count = 0
    $('.reward-icon').on('click', function(e){
        count++
        if(count%2===1){
            $(e.target).addClass('iconfont icon-gou status-on')
        }else {
            $(e.target).removeClass('iconfont icon-gou status-on')
        }
        
    })
    /*显示悬赏金额列表*/
    $('.award-list .select').on('click', function(e){
        $('.reward-select-list').slideDown()

    })
    $('.reward-select-list').on('click', function(e){
        
        if($(e.target).get(0).tagName.toLowerCase() == 'li' || $(e.target).hasClass('iconfont') ){
           let rewardNum = $(e.target).text()
           $('#reward-num').text(rewardNum)
           $('.reward-select-list').slideUp()

        }
    })
    /*随机展现问题名言*/
    var sayingsArray = [
        '提出正确的问题，往往等于解决了问题的大半。 —— 海森堡',
        '创造始于问题，有了问题才会思考，有了思考，才有解决问题的方法，才有找到独立思路的可能。 —— 陶行知',
        '生活的智慧大概就在于逢事都问个为什么。 ——巴尔扎克'
    ]
   
        let index = Math.floor(Math.random()*3)
        let saying = sayingsArray[index]
        $('.ask-slogan').text(saying)
    
    /*为了使用上面的搜索框*/
    

    //新建一个question对象
    var Question = AV.Object.extend('Question')
    var newQuestion = new Question()

    function searchUrl(){
        var url = 'searchResult2.html?'
        var searchContent = $('#search-bar').val()
        if(!searchContent){
            window.location.href = noresult.html
        }
        var parasArray = searchContent.split(' ')
        for(let i = 0; i < parasArray.length; i++){
            url += 'para'+ i + '=' +  parasArray[i] 
            if(i<parasArray.length-1){
                url += '&'
            }
        }
        
        
        window.location.href = url

    }
    $('#search-bar').keydown(function(e){
        if(e.which == 13){
            e.preventDefault()
            searchUrl()
            
        }

    })
    $('#search').on('click', function(e){
        e.preventDefault()
        searchUrl()
    })

    /*监听图片上传*/
    $('#photoFileUpload').on('change', function(){
         var fileUploadControl = $('#photoFileUpload')[0];
        if (fileUploadControl.files.length > 0) {
            var localFile = fileUploadControl.files[0];
            var name = 'questionDetail.jpg';
            

            var file = new AV.File(name, localFile)

            
            newQuestion.set('imageFile', file)//把图片与问题联系起来

            file.save().then(function(file) {
                // 文件保存成功
                //获取缩略图地址
                var newImage = $('<img>').attr('src', file.url())
                newImage.width('100px')
                $('.thumbnail').append(newImage)
                console.log(file.url());
            }, function(error) {
                // 异常处理
                console.error(error);
            });
        }
        
    })
    
   
    
  



    /*退出登录*/
    $('.login-list').on('click', function(e){
       
        if($(e.target).hasClass('log-out')){
             console.log('1')
             AV.User.logOut()
             window.location.href = "login.html"
        }
    })
    