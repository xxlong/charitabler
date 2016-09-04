var InterValObj; //timer变量，控制时间
var count = 120; //间隔函数，1秒执行
var curCount;//当前剩余秒数

function sendMessage() {
	curCount = count;
	var jbPhone = $("#phoneNumber").val();
	// 设置button效果，开始计时
	$("#btnSendCode").attr("disabled", "true");
	$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	InterValObj = window.setInterval(SetRemainTime, 1000); // 启动计时器，1秒执行一次
	// 向后台发送处理数据
	$.ajax({
		type: "POST", // 用POST方式传输
		dataType: "text", // 数据格式:JSON
		url: "user/sendSms", // 目标地址
		data: "name=ImIner&phoneNumber=" + jbPhone,
		error: function (XMLHttpRequest, textStatus, errorThrown) { 
			
		},
		success: function (data){
			data = parseInt(data, 10);
			if(data == 1){
				alert("短信验证码已发到您的手机,请查收");
			}else if(data == 0){
				alert("短信验证码发送失败，请重新发送");
			}else if(data == 2){
				alert("该手机号码今天发送验证码过多");
			}
		}
	});
}

//timer处理函数
function SetRemainTime() {
	if (curCount == 0) {                
		window.clearInterval(InterValObj);// 停止计时器
		$("#btnSendCode").removeAttr("disabled");// 启用按钮
		$("#btnSendCode").val("重新发送验证码");
		code = ""; // 清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
	}else {
		curCount--;
		$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	}
}