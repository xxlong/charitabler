jQuery.AutoComplete=function(selector){
	var elt=$(selector);
	var autoComplete,autoLi;
	var strHtml=[];
	strHtml.push('<div class="AutoComplete" id="AutoComplete">');
    strHtml.push('    <ul class="AutoComplete_ul">');
    strHtml.push('        <li class="AutoComplete_title">请选择邮箱后缀</li>');
    strHtml.push('        <li hz="@qq.com"></li>');
    strHtml.push('        <li hz="@163.com"></li>');
    strHtml.push('        <li hz="@hust.edu.cn"></li>');
    strHtml.push('        <li hz="@126.com"></li>');
    strHtml.push('        <li hz="@sohu.com"></li>');
    strHtml.push('        <li hz="@sina.com"></li>');
    strHtml.push('        <li hz="@volq.org"></li>');
    strHtml.push('    </ul>');
    strHtml.push('</div>');
    $('body').append(strHtml.join(''));
    $('#AutoComplete').css('width',elt.css('width'));

    autoComplete=$('#AutoComplete');
    autoComplete.data('elt',elt);
    autoLi=autoComplete.find('li:not(.AutoComplete_title)');
    autoLi.mouseover(function(){
    	$(this).siblings().filter('.hover').removeClass('hover');
    	$(this).addClass('hover');
    }).mouseout(function(){
    	$(this).removeClass('hover');
    }).mousedown(function(){
    	autoComplete.data('elt').val($(this).text()).change();
    	autoComplete.hide();
    });

    elt.keyup(function(e){
    	if(/13|38|40|116/.test(e.keyCode) || this.value==''){
    		return false;
    	}
    	var name=this.value;
    	if(name.indexOf('@')==-1){
    		autoComplete.hide();
    		return false;
    	}
    	autoLi.each(function(){
    		this.innerHTML=name.replace(/\@+.*/,'')+$(this).attr('hz');
    		if(this.innerHTML.indexOf(name) >= 0){
                $(this).show();
            }else{
                $(this).hide();    
            }
    	}).filter('.hover').removeClass('hover');
    	autoComplete.show().css({
            left: $(this).offset().left,
            top: $(this).offset().top + $(this).outerHeight(true) - 1,
            position: 'absolute',
            zIndex: '99999'
        });
        if(autoLi.filter(':visible').length == 0){
            autoComplete.hide();
        }else{
            autoLi.filter(':visible').eq(0).addClass('hover');            
        }
    }).keydown(function(e){
    	if(e.keyCode == 38){ //上
            autoLi.filter('.hover').prev().not('.AutoComplete_title').addClass('hover').next().removeClass('hover');
        }else if(e.keyCode == 40){ //下
            autoLi.filter('.hover').next().addClass('hover').prev().removeClass('hover');
        }else if(e.keyCode == 13){ //Enter
            autoLi.filter('.hover').mousedown();
            e.preventDefault();    //如有表单，阻止表单提交
        }
    }).focus(function(){
    	autoComplete.data('elt',$(this));
    }).blur(function(){
    	autoComplete.hide();
    });
};

jQuery.cookie=function(cname,cvalue,expiredays){
    if(typeof cname =='undefined'){
        return document.cookie;
    }
    if(typeof cvalue=='undefined'){
        if(document.cookie.length>0){
            c_start=document.cookie.indexOf(cname+'=');
            if (c_start!=1) {
                c_start=c_start+cname.length+1;
                c_end=document.cookie.indexOf(';',c_start);
                if(c_end==-1){
                    c_end=document.cookie.length;
                };
                return unescape(document.cookie.substring(c_start,c_end));
            };
        }
        else{
            return ;
        }
        return ;
    }
    else{
        if (expiredays==null) {
            document.cookie=cname+'='+cvalue;
        }
        else{
            var exdate=new Date();
            exdate.setDate(exdate.getDate()+expiredays);
            //console.log(cname+'='+cvalue+((expiredays==null)?"":";expires="+exdate.toGMTString()));
            document.cookie=cname+'='+cvalue+((expiredays==null)?"":";expires="+exdate.toUTCString());
        };
    };
};

jQuery.clearcookie=function(){
	var expire = -1;
	$.cookie('userId',';path=/',expire);
	$.cookie('name',';path=/',expire);
	$.cookie('avatar',';path=/',expire);
	$.cookie('sex',';path=/',expire);
	$.cookie('phoneNumber',';path=/',expire);
	$.cookie('password',';path=/',expire);
};

function IsLogIn(){
	//console.log(document.cookie);
	if($.cookie('password'))
	{
		return true;
	}else{
		return false;
	}
};
function SetUserInfo(){
    if(IsLogIn()){
        $(".site-header .user").css("display","inline-block");
        $(".site-header .signup").hide();
        $("#userName").text($.cookie("name"));
        $("#logout").click(logout);
    }else{
        $(".site-header .user").hide();
        $(".site-header .signup").show();
    }
}
function SetDeviceInfo(){
    if(getQueryJson().app == 'android'){
        $('.site-header,.filter-sort,.site-footer').hide();
    }
}
function logout() {
    $.clearcookie();
    window.location.href="login.html";
}

//获取url中query的对象
function getQueryJson() {
    var ret = {};
    var query = decodeURI(window.location.search.substr(1)).split("&");
    for (var i = 0; i <query.length; i++)
    {
        var j = query[i].indexOf("=");
        ret[query[i].substring(0, j)] = query[i].substring(j+1);
    }
    return ret;
}
//将对象序列化为url中的query字符串
function jsonToSearch(o) {
    var arr = [];
    for (var i in o) {
        if (i != "") {
            arr.push(i + "=" + o[i]);
        }
    } 
    return encodeURI(arr.join('&'));
}

//HTML转义
function HTMLEncode(html)
{
    var temp = document.createElement ("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}
//HTML反转义
function HTMLDecode(text)
{
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

function makeComment() {
    $("#isCommentOnComment").text(false);
    $("#makeComment").hide();
    $("#validNum").prev().html("<b>评论活动</b>");
}
function commitComment() {
    if($("textarea[name='newComment']").val().trim()!="")
    {
        amplify.request({
            resourceId: "makeComment",
            data: {id: $('#mainId').text(),content: $("textarea[name='newComment']").val(),isCommentOnComment:$("#isCommentOnComment").text(),fatherCommentId:$("#fatherCommentId").text()},
            success: function() {
                getCommentHistory($('#mainId').text(),1);
                $("textarea[name='newComment']").val("");
            },
            error: function() {
                alert("请登陆后评论！");
            }
        });
    }
}
function prevPage() {
    if(parseInt($("#current_page").text())>1)
    {
        var prev=parseInt($("#current_page").text())-1;
        getCommentHistory($('#mainId').text(),prev);
        $("#current_page").text(prev);
    }
}
function nextPage() {
    if(parseInt($("#current_page").text())<parseInt($("#total_page").text()))
    {
        var next=parseInt($("#current_page").text())+1;
        getCommentHistory($('#mainId').text(),next);
        $("#current_page").text(next);
    }
}

function slide(elem) {
    elem.css({"left": "200px", "opacity": 0.3}).fadeIn(100);
    elem.animate({
        left: '0px',
        opacity: '1.0',
    },400);
}

