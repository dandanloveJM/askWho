"use strict"
//初始化AV
    const appId = 'YoUKvGrpeG6iQlrkqeTqrgQU-gzGzoHsz';
    const appKey = 'rvYorKtJCDBTL5bmbiINj99c';
    const region = 'cn';
    
    
    AV.init({ appId, appKey, region });

    
    var currentUser = AV.User.current()
   
    if(currentUser){
        var currentUserID = AV.User.current().id
        var user = AV.Object.createWithoutData('_User', currentUserID);
        user.fetch().then(function () {
            var realName = user.get('realName');
            $('.u-info-name').text(realName)
            
            //真实姓名的获取是异步的

             //把我的提问取进页面
            var myQuery = new AV.Query('Question')
            myQuery.equalTo('username', realName)
            myQuery.find().then(function(results){
                if(results.length === 0){

                    let tip = $('<p style="padding:30px;"></p>').text('暂无记录，快去提问吧!')
                    $('#ask-history').append(tip)
                }
                results.forEach(function(result){
                    let title = result.get('title')
                    let time = result.get('time')
                    let answerNumber = result.get('answerNumber')
                    let id = result.id

                    let html = `
                        <a href="myQuestionDetail.html?id=${id}" class="list-item">
                            <div class="title-info">
                                ${title}
                            </div>
                            
                            <div class="extra-info">
                               
                                <span class="time">${time}</span>
                            </div>
                        </a>
                    `

                    $('#ask-history').append(html)

                })

            })


             /*把我的回答取进页面*/
    var myAnswer = new AV.Query('Answer')
    myAnswer.equalTo('authorName', realName)
    myAnswer.find().then(function(results){
        if(results.length === 0){

            let tip = $('<p style="padding:30px;"></p>').text('暂无记录，快去回答问题吧!')
            $('#answers-history').append(tip)
        }

       let myAnswerNumber = results.length
       $('.i-answer> .right em').text(myAnswerNumber)

        results.forEach(function(result){
           
            let time = result.get('time')
            let thumbUp = result.get('thumbUp')
            let id = result.id
            let content = result.get('content')
            let question = result.get('dependent')
            let questionID = question.id

            let currentQuestion = AV.Object.createWithoutData('Question', questionID)
            currentQuestion.fetch().then(function () {
                var title = currentQuestion.get('title');// 读取 title
                let html = `
                <a href="MyQuestionDetail.html?id=${questionID}" class="list-item">
                    <div class="title">${content}</div>
                    <div class="ask-info">
                        <span>${title}</span>
                    </div>
                    <div class="extra-info">
                        <i class="icon-thumbs-up"></i>
                        <span class="thumb-up-num">${thumbUp}</span>
                        <span class="time">${time}</span>
                    </div>
                </a>

                `
             $('#answers-history').append(html)

               
            }, function (error) {
                // 异常处理
            });

          
           

        })

    })


    /*把我的财富值变化取进页面*/
    var myFortune = new AV.Query('UserInfo')
    myFortune.equalTo('username', realName)
    myFortune.find().then(function(results){
       
        results.forEach(function(result){
           
            let reasonHistory = result.get('reasonHistory')
            
            if(!reasonHistory){
                let tip = $('<p style="padding:30px;"></p>').text('暂无记录，快去回答赢取财富值吧!')
                $('#fortuneChange').append(tip)
            }
           
            let time = result.updatedAt
            
            let changeHistory = result.get('changeHistory')
           
            let goalTime = new Date(time)
          
            let fortune = result.get('fortune')

            goalTime = goalTime.getFullYear() + '-' + (goalTime.getMonth()+1) + '-' + goalTime.getDate()
            
            let changeMoney = `<p class="num">${fortune}</p>`
                 $('.u-banner> .money').append(changeMoney)

                 let changeMoney2 = `
                    <span class="number"><em>${fortune}</em>点</span>
                    <ul class="button clearfix">
                        <li>
                            <a href="" class="button-item topics">充值</a>
                        </li>
                        <li>
                            <a href="" class="button-item topics">兑换奖品</a>
                        </li>
                        <li>
                            <a href="#fortune" class="button-item topics">交易记录</a>
                        </li>
                    </ul>
                    `
                 $('.balance').append(changeMoney2)

            //构造当前回答的相应的问题对象
                var html = ``
                for(let i = 0; i < reasonHistory.length; i++){
                    html += `
                        <li>
                            <p class="time">${goalTime}</p>
                            <p class="things">${reasonHistory[i]}</p>
                            <p class="count-change">
                                <em>财富值</em>
                                <span class="em-txt">${changeHistory[i]}</span>
                            </p>
                        </li>

                        `
                       
                }
           
                
                 $('.myhistory-list').append(html)

                 

        })

    })







    }, function (error) {
        // 异常处理
    });

            

    
        

   }

   //把没有解决的问题取进页面
     var query = new AV.Query('Question');
     query.equalTo('answerNumber', '0')
     query.find().then(function (results) {
        //把结果取出来
        results.forEach(function(result){
            let title = result.get('title')
            let answerNumber = result.get('answerNumber')
            let time = result.get('time')
            let reward = result.get('reward')
            let questionID = result.id
    

            let html = `
                <a href="questionDetail.html?id=${questionID}" class="list-item">
                    <div class="title-info">
                        <h4>${title}<span class="reward"><i class="icon-trophy"></i>悬赏${reward}分</span></h4>                
                    </div>
                    
                    <div class="extra-info">
                        
                        <span class="time">${time}</span>
                    </div>
                </a>
            `

            $('#wait-answer').append(html)

        })
        }, function (error) {
    });

   

   







    /*切换选项卡*/
    var $menuTabs = $('.menu>li')

    $('.menu').on('click', function(e){
        if($(e.target).hasClass('menu-tab')){
            var index = $(e.target).index()
            $.each($('.menu>li'), function(index, val){
                $(this).removeClass('active')
            })
            $(e.target).addClass('active')
            $(this).parents('.layout').find('.list').removeClass('active')
            $(this).parents('.layout').find('.list').eq(index).addClass('active')
            
        }

    })

    /*退出登录*/
    $('.log-out').on('click', function(e){
        AV.User.logOut()
    })