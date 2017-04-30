"use strict"
//初始化AV
    const appId = 'YoUKvGrpeG6iQlrkqeTqrgQU-gzGzoHsz';
    const appKey = 'rvYorKtJCDBTL5bmbiINj99c';
    const region = 'cn';
    
    AV.init({ appId, appKey, region });
    
    function setName(){
        var realName = $('#name').val()
        console.log(realName)
        var currentUser = AV.User.current()
        if(currentUser){
            let currentID = currentUser.id
            console.log(currentID)
            var User = AV.Object.createWithoutData('_User', currentID)
            User.set('realName', realName)
            User.save()
            
            
           User.save().then(function(){
              

               	var UserInfo = AV.Object.extend('UserInfo')
			    var userInfo = new UserInfo()
			    userInfo.set('user', User)
                userInfo.set('username', realName)
                userInfo.save().then(function(){
                   
                    window.location.href = './index.html'
                })

                
           })
        }

    }

    $('.course').on('click', function(e){
        e.preventDefault()
        setName()

        

    })