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
        if (file) {
            var imageID = file.id
            var imageUrl
            // 第一个参数是 className，第二个参数是 objectId
            let imageFile = AV.Object.createWithoutData('_File', imageID);
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

        } else {//没有图
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
            if (!questionContent) {
               
                $('.question-content').empty()
            }


        }





    }, function (error) {
        console.log('error')
    });

    //根据问题ID取出问题的答案
    var queryForAnswer = new AV.Query('Answer')
    var currentQuestion = AV.Object.createWithoutData('Question', para)
    queryForAnswer.equalTo('dependent', currentQuestion)
    queryForAnswer.include('dependent')
    queryForAnswer.find().then(function (answers) {
        answers.forEach(function (answer) {
            let authorName = answer.get('authorName')
            let thumbUp = answer.get('thumbUp')
            let time = answer.get('time')
            let content = answer.get('content')
            let file = answer.get('imageFile')
            let thumbDown = answer.get('thumbDown')
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
                if (imageUrl) {
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

                    </li>
                
                `

                } else {
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

                    </li>
                
                `



                }



                $('.answer').append(html)



            }, function (error) {
                // 异常处理
            });






        })

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
    $('.answer').on('click', function (e) {
        e.preventDefault()
       
        if ($(e.target).hasClass('thumb-up') || $(e.target).hasClass('icon-thumbs-up') || $(e.target).hasClass('thumbUpNum')) {

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

        } else
            if ($(e.target).hasClass('thumb-down') || $(e.target).hasClass('icon-thumbs-down') || $(e.target).hasClass('thumbDownNum')) {
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
        var currentUser = AV.User.current()
        if (currentUser) {
            var currentUserID = AV.User.current().id
            var user = AV.Object.createWithoutData('_User', currentUserID);
            user.fetch().then(function () {
                var realName = user.get('realName');// 读取姓名
               
                var question = AV.Object.createWithoutData('Question', para);
                var currentUser = AV.User.current()
                var currentUserId = currentUser.id
                var CurrentUser = AV.Object.createWithoutData('_User', currentUserId)
                let answerAuthor = realName
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
                newAnswer.set('author', CurrentUser)

                newAnswer.save().then(function() {
                    window.location.href = window.location.href
                })


            })

        }





    })

    /*退出登录*/
    $('.logOut').on('click', function () {
        AV.User.logOut();
        window.location.href = "register.html";

    })

    /*判断是否登录*/
    /*判断是否登录*/
    var currentUser = AV.User.current()
    if (currentUser) {
        var currentUserID = AV.User.current().id
        var user = AV.Object.createWithoutData('_User', currentUserID);
        user.fetch().then(function () {
            var realName = user.get('realName');// 读取 title
            var loginListContent = `
            <a href="selfCenter.html" class="first corner selfCenter">我的个人中心</a>
            <a href="#" class="corner log-out">退出登陆</a>
            
            `
            $('.login-list').append(loginListContent)
            

        }, function (error) {
            // 异常处理
        });


    } else {
        var pleaseLoginOrRegister = `
            
           <a href="register.html" class="first corner">注册</a>
           <a href="login.html"  class="corner">登录</a>
        `
        $('.login-list').append(pleaseLoginOrRegister)
        //隐藏提问部分，只有登录了才能提问
        $('.submit').attr('disabled', true)
        $('.submit').css({ 'cursor': 'not-allowed' })

    }
