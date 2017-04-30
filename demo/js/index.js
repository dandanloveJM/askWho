 //初始化AV
    "use strict"
    const appId = 'YoUKvGrpeG6iQlrkqeTqrgQU-gzGzoHsz';
    const appKey = 'rvYorKtJCDBTL5bmbiINj99c';
    const region = 'cn';
    
    AV.init({ appId, appKey, region });

    var inputFlag = false
    $('input').on('focus', function(e){
        if(inputFlag){
            return 
        }
        findQuestion('*')
        inputFlag = true
    })
    
    $('input').on('input', function(e){
        if($(this).val() && $(this).val() != ' '){
            $('.list').empty()
            var para = $(this).val()
            findQuestion(para)
        }
        console.log($(this).val())
        //findQuestion(this.value)
    })

     //搜索问题
    function findQuestion(para){
        var query = new AV.SearchQuery('Question');
        query.queryString(para);
        query.find().then(function(results) {
        console.log("Find " + query.hits() + " docs.");
            
            results.forEach(function(result){
                let title = result.get('title')
                console.log(title)
                let id = result.id
                let html = `
                    <li>
                        <a href="questionDetail.html?id=${id}">${title}</a>
                    </li>`
                  $('.suggestion>.list').append(html)
            })
          
        //处理 results 结果
        }).catch(function(err){
        //处理 err
        });

    }
    
    function makeSuggestionHTML(title, id){
        let html = `
            <li>
                <a href="questionDetail.html?id=${id}">${title}</a>
            </li>`
        return html
    }


    var currentUser = AV.User.current()
    if(currentUser){
        var currentUserID = AV.User.current().id
        var user = AV.Object.createWithoutData('_User', currentUserID);
        user.fetch().then(function () {
            var realName = user.get('realName');// 读取 title
            var loginListContent = `
            <li class="selfCenter">您好，${realName}，<a href="selfCenter.html">我的个人中心</a></li>
            <li class="logOut"><a href="#" class="log-out">退出登录</a></li>
            `
            $('.login-list').append(loginListContent)
            console.log(currentUserID)
            var courseHTML = `
            <div class="yourGroup clearfix">
                <h5>这学期您的课程表如下，点击可进入对应学习小组</h5>
                <table>
                    <tbody>
                        <tr class="tr1">
                        <td>星期一</td>
                        <td>星期二</td>
                        <td>星期三</td>
                        <td>星期四</td>
                        <td>星期五</td>
                        </tr>
                        <tr>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">高等数学下</p>
                            <p class="teacher">童丽珍</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">电子政务与电子商务</p>
                            <p class="teacher">张新香</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">线性代数</p>
                            <p class="teacher">卢国祥</p>
                            </a>
                        </td>
                        <td></td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">电子政务与电子商务</p>
                            <p class="teacher">张新香</p>
                            </a>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">线性代数</p>
                            <p class="teacher">卢国祥</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">法学通论</p>
                            <p class="teacher">韩桂军</p>
                            </a>
                        </td>
                        <td></td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">数据库管理实务</p>
                            <p class="teacher">王会举</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">体育专项</p>
                            <p class="teacher">李辉</p>
                            </a>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">实用翻译</p>
                            <p class="teacher">汪世蓉</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">程序开发与实践</p>
                            <p class="teacher">余传明</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">计算机网络原理</p>
                            <p class="teacher">刘琪</p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course"></p>
                            <p class="teacher"></p>
                            </a>
                        </td>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course"></p>
                            <p class="teacher"></p>
                            </a>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <a href="groupDetail.html">
                            <p class="course">计算机网络原理</p>
                            <p class="teacher">刘琪</p>
                            </a>
                        </td>
                        <td><a href="groupDetail.html">
                            <p class="course"></p>
                            <p class="teacher"></p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course"></p>
                            <p class="teacher"></p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course"></p>
                            <p class="teacher"></p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course">建模语言</p>
                            <p class="teacher">屈振新</p>
                            </a></td>
                        </tr>
                        <tr>
                        <td><a href="groupDetail.html">
                            <p class="course">数据库管理实务</p>
                            <p class="teacher">王会举</p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course">文革电影评析</p>
                            <p class="teacher">李军湘</p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course">国际大案</p>
                            <p class="teacher">戴涛</p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course">文革电影评析</p>
                            <p class="teacher">李军湘</p>
                            </a></td>
                        <td><a href="groupDetail.html">
                            <p class="course"></p>
                            <p class="teacher"></p>
                            </a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `
            $('.yourCourse').append(courseHTML)

        }, function (error) {
            // 异常处理
        });
        
       
    }else {
        var pleaseLoginOrRegister = `
            <li class="selfCenter"><a href="register.html">注册</a></li>
            <li class="logOut"><a href="login.html">登录</a></li>
        `
        $('.login-list').append(pleaseLoginOrRegister)



    }
    
    function searchUrl(){
        var url = 'searchResult2.html?'
        var searchContent = $('.input').val()
        var parasArray = searchContent.split(' ')
        for(let i = 0; i < parasArray.length; i++){
            url += 'para'+ i + '=' +  parasArray[i] 
            if(i<parasArray.length-1){
                url += '&'
            }
        }
        
        
        window.location.href = url

    }
    $('.input').keydown(function(e){
        if(e.which == 13){
            e.preventDefault()
            searchUrl()
            
        }

    })
    $('.button').on('click', function(e){
        e.preventDefault()
        searchUrl()
    })
   
    
  

    /*退出登录*/
    $('.login-list').on('click', function(e){
       
        if($(e.target).hasClass('log-out')){
             console.log('1')
             AV.User.logOut()
             window.location.href = "login.html"
        }
    })
   
