/**
 * @File Name		: DDAction.java
 * @Package   	: com.fanglin.dingding.action
 * @Version		: 1.0
 * @Date			: 2015-11-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.service.CallbackService;

@ParentPackage("login")
@Namespace("/")
@Controller
public class DTalkCallback extends BaseListAction {

	private static final long serialVersionUID = -6593413211279089778L;

	@Autowired
	private CallbackService ddCallbackService;

	private String signature;
	
	private String msg_signature;

	private String timestamp;
	
	private String timeStamp;

	private String nonce;

	private String encrypt;

	@Action(value = "dtalkCallback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String dtalkCallback() throws FLException {
		
		JSONObject params = JSONObject.parseObject(getRequestPostData(request));
		
		encrypt = params.getString("encrypt");
		
		packageEcrypt(ddCallbackService.callback(signature, nonce, timestamp, encrypt));

		return SUCCESS;
	}
	
    private String getRequestPostData(HttpServletRequest request){
    	
        try {
			int contentLength = request.getContentLength();
			
			if(contentLength<0){
			    return "";
			}
			
			byte buffer[] = new byte[contentLength];
			
			for (int i = 0; i < contentLength;) {
			    int len = request.getInputStream().read(buffer, i, contentLength - i);
			    
			    if (len == -1) break;
			    
			    i += len;
			}
			return new String(buffer, "utf-8");
		} catch (Exception e) {
			return "";
		}
    }

	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getNonce() {
		return nonce;
	}

	public void setNonce(String nonce) {
		this.nonce = nonce;
	}

	public String getEncrypt() {
		return encrypt;
	}

	public void setEncrypt(String encrypt) {
		this.encrypt = encrypt;
	}

	public String getMsg_signature() {
		return msg_signature;
	}

	public void setMsg_signature(String msg_signature) {
		this.msg_signature = msg_signature;
	}

	public String getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(String timeStamp) {
		this.timeStamp = timeStamp;
	}
	
	private void packageEcrypt(Map<String, String> encryptResult){
		setMsg_signature(encryptResult.get("msg_signature"));
		setTimeStamp(encryptResult.get("timeStamp"));
		setNonce(encryptResult.get("nonce"));
		setEncrypt(encryptResult.get("encrypt"));
	}

}
