"use strict"
//初始化AV
    const appId = 'YoUKvGrpeG6iQlrkqeTqrgQU-gzGzoHsz';
    const appKey = 'rvYorKtJCDBTL5bmbiINj99c';
    const region = 'cn';

    AV.init({ appId, appKey, region });
    /*新建一个答案对象*/
    var Answer = AV.Object.extend('Answer')
    var newAnswer = new Answer()

    //解析url获取值
    function getQueryString(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    }
    var para = getQueryString('id')//拿到Question对象的id
    var para2 = getQueryString('answer')

    //根据Id取出该问题的存的值
    var query = new AV.Query('Question');
    query.get(para).then(function (question) {
        
        let questionTitle = question.get('title')
        let questionContent = question.get('content')
        let questionTag = question.get('questionTag')
        let reward = question.get('reward')
        let username = question.get('username')
        let questionTime = question.get('time')
        let newQuestionTags = []
        let file = question.get('imageFile')
        if (file) {//如果有图片的话
            var imageID = file.id
            var imageUrl
            let imageFile = AV.Object.createWithoutData('_File', imageID)
            imageFile.fetch().then(function () {
                imageUrl = imageFile.get('url')
                for (let i = 0; i < questionTag.length; i++) {
                   
                    var newTag = $('<span class="topics"></span>').text(questionTag[i])
                    $('.question-header').append(newTag)

                }

                let html = `
                <h1 class="question-header-title"> 
                    <span class="reward">
                        <i class="icon-trophy"></i>悬赏${reward}分
                    </span>${questionTitle}
                </h1>
                <div class="question-content">
                    <p>${questionContent}</p>
                    <img src="${imageUrl}" >
                </div>
                <h5 class="asker">
                    <span class="askAuthor">提问者：${username}</span>
                    <span class="askAuthor">提问时间：${questionTime}</span>
                </h5>

            `
           
                $('.question-header').append(html)
            }, function (error) {
                // 异常处理
            });

        }else{//没有图片
            let html = `
                <h1 class="question-header-title"> 
                    <span class="reward">
                        <i class="icon-trophy"></i>悬赏${reward}分
                    </span>${questionTitle}
                </h1>
                <div class="question-content">
                    <p>${questionContent}</p>
                    
                </div>
                <h5 class="asker">
                    <span class="askAuthor">提问者：${username}</span>
                    <span class="askAuthor">提问时间：${questionTime}</span>
                </h5>

            `
           
             $('.question-header').append(html)
             if(!questionContent){
                
                 $('.question-content').empty()
             }
        }

       
        



    }, function (error) {
        console.log('error')
    });

    var statusArray = []
    //根据问题ID取出问题的答案
    var queryForAnswer = new AV.Query('Answer')
    var currentQuestion = AV.Object.createWithoutData('Question', para)
    queryForAnswer.equalTo('dependent', currentQuestion)
    queryForAnswer.include('dependent')
    queryForAnswer.descending('status');
    queryForAnswer.find().then(function (answers) {
        answers.forEach(function (answer) {
            let authorName = answer.get('authorName')
            let thumbUp = answer.get('thumbUp')
            let time = answer.get('time')
            let content = answer.get('content')
            let file = answer.get('imageFile')
            let thumbDown = answer.get('thumbDown')
            let status = answer.get('status')
            statusArray.push(status)
            let answerID = answer.id
            if (file) {
               
                var imageID = file.id
               
                var imageUrl
                
            }

            // 第一个参数是 className，第二个参数是 objectId
            let imageFile = AV.Object.createWithoutData('_File', imageID);
            imageFile.fetch().then(function () {
                imageUrl = imageFile.get('url')
               
                let html
              
               if(imageUrl){//有图
                   html = `
                    <li data-id="${answerID}">
                        <div class="author-line">
                            <a href="#" class="author">${authorName}</a> <br>
                            <span class="badge topics">2016春 高数下童丽珍老师小组成员</span>
                        </div>
                        <div class="answer-detail">
                            <img src="${imageUrl}">
                            <p>${content}</p>
                        </div>
                        <div class="answer-time">
                            <a href="#" class="time">发布于${time}</a>
                        </div>
                        <div class="comment">
                            <a href="#" class="thumb-up"><i class="icon-thumbs-up"></i>
                            <span class="thumbUpNum">${thumbUp}</span></a>
                            <a href="#" class="thumb-down"><i class="icon-thumbs-down"></i>
                            <span class="thumbDownNum">${thumbDown}</span></a>
                        </div>
                        <div class="adopt">
                            <a href="#" class="adopt-btn">采纳回答</a>
                        </div>

                    </li>
                
                `
               
               }else  {//没有图
                   html = `
                    <li data-id="${answerID}">
                        
                        <div class="author-line">
                            <a href="#" class="author">${authorName}</a> <br>
                            <span class="badge topics">2016春 高数下童丽珍老师小组成员</span>
                        </div>
                        <div class="answer-detail">
                            <p>${content}</p>
                        </div>
                        <div class="answer-time">
                            <a href="#" class="time">发布于${time}</a>
                        </div>
                        <div class="comment">
                            <a href="#" class="thumb-up"><i class="icon-thumbs-up"></i>
                            <span class="thumbUpNum">${thumbUp}</span></a>
                            <a href="#" class="thumb-down"><i class="icon-thumbs-down"></i>
                            <span class="thumbDownNum">${thumbDown}</span></a>
                        </div>
                        <div class="adopt">
                            <a href="#" class="adopt-btn">采纳回答</a>
                        </div>

                    </li>
                
                `
               }
                $('.answer').append(html)



            
            
            },function (error) {
                // 异常处理
            });






        })

        return statusArray

    }, function (error) {
        console.log(error)
    })



    /*为了使用上面的搜索框*/


    function searchUrl() {
        var url = 'searchResult2.html?'
        var searchContent = $('#search-bar').val()
        
        var parasArray = searchContent.split(' ')
        for (let i = 0; i < parasArray.length; i++) {
            url += 'para' + i + '=' + parasArray[i]
            if (i < parasArray.length - 1) {
                url += '&'
            }
        }


        window.location.href = url

    }
    $('#search-bar').keydown(function (e) {
        if (e.which == 13) {
            e.preventDefault()
            searchUrl()

        }

    })
    $('#search').on('click', function (e) {
        e.preventDefault()
        searchUrl()
    })







    /*点赞*/
    var upCount = 0
    var downCount = 0
    $('.answer').on('click', function(e){
        e.preventDefault()
        if($(e.target).hasClass('adopt-btn')){
            e.preventDefault()
            e.stopPropagation()
           
            
            

            //把当前问题的id传入dialog的属性中
            var dataID = $(e.target).closest('li').attr('data-id')
            
            $('.dialog').attr('data-answerID', dataID)
            $('.dialog').show()
           
        }
        if($(e.target).hasClass('thumb-up') || $(e.target).hasClass('icon-thumbs-up') ||  $(e.target).hasClass('thumbUpNum') ){
            
            upCount++
            
            var num = $(e.target).closest('.comment').find('.thumbUpNum').text()
            
            var preNum = num
            if (upCount % 2 == 1) {
                num++
               $(e.target).closest('.comment').find('.thumbUpNum').text(num)
               let currentID = $(e.target).closest('li').attr('data-id')
               let answer = AV.Object.createWithoutData('Answer', currentID)
               answer.set('thumbUp', num)
               answer.save()
              
            } else {
                preNum--
                $(e.target).closest('.comment').find('.thumbUpNum').text(preNum)
                let currentID = $(e.target).closest('li').attr('data-id')
                let answer = AV.Object.createWithoutData('Answer', currentID)
                answer.set('thumbUp', preNum)
                answer.save()
            }

        }else 
        if($(e.target).hasClass('thumb-down') || $(e.target).hasClass('icon-thumbs-down') || $(e.target).hasClass('thumbDownNum') ){
            downCount++
            var num = $(e.target).closest('.comment').find('.thumbDownNum').text()
            var preNum = num
            if (downCount % 2 == 1) {
                num++
                $(e.target).closest('.comment').find('.thumbDownNum').text(num)
            } else {
                preNum--
                $(e.target).closest('.comment').find('.thumbDownNum').text(preNum)
            }
            

        }
    })


    /*编辑器*/
    $('#font-size').click(function () {
        $('#font-size-menu').toggle()
    })


    /*清空初始答案*/
    $('#editor').on('click', function (e) {
        $('.initContent').remove()


    })

    /*监听图片上传*/
    $('#insertImage').on('change', function () {
        var fileUploadControl = $('#insertImage')[0];
        if (fileUploadControl.files.length > 0) {
            var localFile = fileUploadControl.files[0];
            var name = 'AnswerDetail.jpg';


            var file = new AV.File(name, localFile)


            newAnswer.set('imageFile', file)//把图片与问题联系起来

            file.save().then(function (file) {
                // 文件保存成功
                //获取缩略图地址
                var url = file.url()
                var id = file.id
                
                var newImage = `
                    <a href="#" class="thumb">
                        <div class="hover"><p>点击删除</p></div>
                        <img class="image" src="${url}" data-id="${id}" style="width:150px">
                    </a>
                `

                $('.thumbNail').append(newImage)

            }, function (error) {
                // 异常处理
                console.error(error);
            });
        }

    })
    /*删除图片*/
    $('.thumbNail').on('click', function (e) {
        e.preventDefault()

        if (e.target.tagName.toLowerCase() === 'div') {
            
            var imageId = $(e.target).closest('.thumb').find('img').attr('data-id')
            var imageDelete = AV.Object.createWithoutData('_File', imageId)
            imageDelete.destroy().then(function (success) {
                $(e.target).closest('.thumb').remove()
            }, function (error) {
                console.log(error)
            });

        }
    })
    $('#submit').on('click', function (e) {

        e.preventDefault()
        
        var question = AV.Object.createWithoutData('Question', para);
        var currentUser = AV.User.current()
        let answerAuthor = currentUser.get('realName')
        let answerContent = $.trim($('.answerContent').val())
        
        let time = ''
        let nowTime = new Date()
        let nowMonth = nowTime.getMonth() + 1
        time = nowTime.getFullYear() + '-' + nowMonth + '-' + nowTime.getDate()

        /*将数据存入数据库*/
        newAnswer.set('authorName', answerAuthor)
        newAnswer.set('content', answerContent)
        newAnswer.set('time', time)
        newAnswer.set('dependent', question)

        newAnswer.save().then(function () {
            window.location.href = window.location.href



        })





    })

    $('.dialog').on('click', function(e){
       
        
         if($(e.target).hasClass('sure')){
             var answerID = $(this).attr('data-answerID')
             //回答者的财富值
             
             var answerMoney
             //回答者的userinfo表的id值
             var answererUIID
            
             //提问者的userinfo表的id值
             var questionerUIID

             
          

                let query = new AV.Query('Question')
                query.get(para).then(function (question) {
                    
                    var questionReward = question.get('reward')//得到问题的悬赏值
                   
                    let nowQuestion = AV.Object.createWithoutData('Question', para)
                    nowQuestion.set('flag', true)
                    nowQuestion.save()
                   
                    //通过问题的id生成答案对象,从问题对象中取出存的该问题回答者
                    let query4answer = AV.Object.createWithoutData('Answer', answerID)//回答者
                    query4answer.fetch().then(function () {
                        
                        query4answer.set('status', 1)//设定该答案的状态为已采纳
                        var author = query4answer.get('author')//回答者
                       
                        var authorID = author.id
                        query4answer.save()
                        
                        var Answerer = AV.Object.createWithoutData('_User', authorID)
                        
                        let query4UserInfo = new AV.Query('UserInfo')
                        query4UserInfo.equalTo('user', Answerer)
                        query4UserInfo.include('user')
                        query4UserInfo.find().then(function (answerer) {
                           
                            //获得原来的值
                            answererUIID = answerer[0].id//回答者的userinfo表的id值
                            
                            var answererMoney = answerer[0].attributes['fortune']//得到回答者现在的财富值
                           
                            let answererHistory = answerer[0].attributes['reasonHistory']
                            let answererChangeHistory = answerer[0].attributes['changeHistory']
             

                            //计算并更新回答者和提问者的财富值
                            answererMoney = answererMoney + questionReward
                            
                           answererHistory.push('回答被采纳为最佳答案')
                           
                            //计算财富值变化历史的数组
                            
                            answererChangeHistory.push('+' + questionReward)

                            //更新回答者和提问者的财富值
                            var UserInfoForAnswerer = AV.Object.createWithoutData('UserInfo', answererUIID)
                            UserInfoForAnswerer.set('fortune', answererMoney)
                            UserInfoForAnswerer.set('reasonHistory', answererHistory)
                            UserInfoForAnswerer.set('reasonObject', nowQuestion)
                            UserInfoForAnswerer.set('changeHistory', answererChangeHistory)
                            UserInfoForAnswerer.save().then(function() {
                              
                                 $('.dialog').hide()
                                 window.location.href = 'solvedQuestionDetail.html?id='+ para
                            }, function (error) {
                               
                            })
                        })
                    })





                })
            //}



            

            
         
            

        }else if($(e.target).hasClass('close')) {
            $('.dialog').hide()

        }else {
            e.stopPropagation()
        }
    })
    /*退出登录*/
    $('.logOut').on('click', function(){
         AV.User.logOut();
         window.location.href = "register.html";

    })