"use strict"
    //初始化AV
    const appId = 'YoUKvGrpeG6iQlrkqeTqrgQU-gzGzoHsz';
    const appKey = 'rvYorKtJCDBTL5bmbiINj99c';
    const region = 'cn';
    
    AV.init({ appId, appKey, region });
    
    //解析url获取值
    function getQueryString(key){
        var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }
    var para = getQueryString('para0')
    console.log(para)

    // handlebars context
    var context = {
        questions: []
    };

    function findQuestion(string){
        var query = new AV.Query('Question');
        query.contains('title', string)
       
        console.log(string)
        query.find().then(function(results) {
            console.log(results)
            console.log(results.length)
            if(results.length === 0 ){
                window.location.href = 'noresult.html'
                return
            }
            let resultNumber = results.length
            let i = 0
            results.forEach(function(result){
                var questionTitle = result.get('title')
                console.log(questionTitle)
                var questionTime = result.get('time')
                var answerNumber = result.get('answerNumber')
                //得到ID去找相应问题的答案
                var questionID = result.id
                console.log(questionID)
                var answerAuthorName, answerContent, thumbUp
             
                //查询答案

                var query1 = new AV.Query('Answer')
                var questions = AV.Object.createWithoutData('Question', questionID)
                query1.equalTo('dependent', questions)
                query1.include('dependent')
                query1.first().then(function(results){
                    console.log(results)
                    i++
                    if(!results){
                        return;
                        context.questions.push({
                        questionID,
                        questionTitle,
                        questionTime,
                        answerNumber
    
                    });
                        makeHtml(context)
                        return
                    }
               
                    answerAuthorName = results.get('authorName')
                    answerContent = results.get('content')
                    thumbUp = results.get('thumbUp')
                
                    context.questions.push({
                        questionID,
                        questionTitle,
                        questionTime,
                        answerNumber,
                        answerAuthorName,
                        answerContent,
                        thumbUp
                    });

                    if(i === resultNumber){
                        return context.questions
                    }
                    return undefined
                    

                }, function(error){
                    console.log('error')
                }).then(function(context){
                   if(context){
                       makeHtml(context)


                   }


                })
                
            })

            
        }).catch(function(err){
        //处理 err
        });

    }

    findQuestion(para)

    //将搜索结果展示在页面中
    function makeHtml(context){
        let newStr = ''
        for(let i = 0; i < context.length; i++){
            newStr += 
            `
            <li>
                <div class="title">
                    <a href="solvedQuestionDetail.html?id=${context[i].questionID}" >
                        ${context[i].questionTitle}
                    </a>
                </div>
                <div class="details">
                    <div class="author-line">
                        <a href="#" class="author">${context[i].answerAuthorName}</a>
                        <i class="icon-star">优秀回答者</i>
                        <span class="topics">2016春 高数下童丽珍老师小组成员</span>
                    </div>
                    <div class="answer">
                        ${context[i].answerContent}
                    </div>
                    <div class="actions">
                        <span class="time">${context[i].questionTime}</span>
                        <span class="answerNumber">${context[i].answerNumber}个回答</span>
                        <span class="thumbs-up"><i class="icon-thumbs-up"></i>${context[i].thumbUp}</span>
                    </div>
                </div>
            </li>
            `

        }

        $('.questions').append(newStr)


    }

    //在本页面的搜索框进行搜索

    $('#search-bar').keydown(function(e){
        if(e.which == 13){
            e.preventDefault()
            searchUrl()
            var para = getQueryString('para0')
            findQuestion(para)
           
        }

    })

    $('#search').on('click', function(e){
        e.preventDefault()
        searchUrl()
        var para = getQueryString('para0')
        findQuestion(para)
    })

    function searchUrl(){
        var url = 'searchResult2.html?'
        var searchContent = $('#search-bar').val()
        var parasArray = searchContent.split(' ')
        for(let i = 0; i < parasArray.length; i++){
            url += 'para'+ i + '=' +  parasArray[i] 
            if(i<parasArray.length-1){
                url += '&'
            }
        }
        
        window.location.href = url

    }
