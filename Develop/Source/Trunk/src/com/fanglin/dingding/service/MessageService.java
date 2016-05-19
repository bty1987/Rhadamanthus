/**
 * @File Name		: MessageService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2015-11-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fanglin.dingding.po.AppMessageDelivery;
import com.fanglin.dingding.po.OAMessage;
import com.fanglin.dingding.utils.AuthHelper;
import com.fanglin.dingding.utils.Constant;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.utils.SystemConfig;

public class MessageService {
	
	public static int send(AppMessageDelivery delivery){
		
		Logger logger = LoggerFactory.getLogger(MessageService.class);
		
		try {
			String accessToken = AuthHelper.getAccessToken();
			
			String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken);
			
			HttpHelper.httpPost(url, delivery.toJsonObject());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		return 0;
	}
	
	public static int sendMessageForApproval(String receiveId, String senderName, int approvalId, String type, String contents){
		
		String accessToken = AuthHelper.getAccessToken();
		
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", Constant.APPROVAL_AGENTID_STR);
		
		OAMessage oaMessage = new OAMessage();
		oaMessage.message_url = SystemConfig.getString(Constant.LOCAL_HOST_STR) + "/dingding/approval/index.html?approval.aid=" + approvalId;
		OAMessage.Head head = new OAMessage.Head();
		head.bgcolor = "FFCC0000";
		oaMessage.head = head;
		OAMessage.Body body = new OAMessage.Body();
		body.title = type;
		body.content = contents;
		body.author = senderName;
		oaMessage.body = body;
		
		appMessageDelivery.withMessage(oaMessage);
		
		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken);
		
		HttpHelper.httpPost(url, appMessageDelivery.toJsonObject());
		
		return 0;
	}
	
}
