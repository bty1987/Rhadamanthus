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
import com.fanglin.dingding.po.TextMessage;
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
		
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", SystemConfig.getString(Constant.APPROVAL_AGENTID_STR));
		
		OAMessage oaMessage = new OAMessage();
		oaMessage.message_url = String.format("%s/dingding/approval/approvalItem.html?approval.aid=%s", SystemConfig.getString(Constant.MP_HOST_STR), approvalId);
		OAMessage.Head head = new OAMessage.Head();
		head.bgcolor = "FFE8643E";
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
	
	public static int sendMessageForPayment(String receiveId, String senderName, String contents){
		
		TextMessage textMessage = new TextMessage(contents);
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", SystemConfig.getString(Constant.MESSAGE_AGENTID_STR));
		appMessageDelivery.withMessage(textMessage);
		com.fanglin.dingding.service.MessageService.send(appMessageDelivery);
		
		return 0;
	}
	
	public static int sendMessageForBackVisit(String receiveId, String senderName, String orderId, String contents){
		
		String accessToken = AuthHelper.getAccessToken();
		
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", SystemConfig.getString(Constant.SALESMAN_AGENTID_STR));
		
		OAMessage oaMessage = new OAMessage();
		oaMessage.message_url = String.format("%s/dingding/salesman/backvisit.html?orderid=%s", SystemConfig.getString(Constant.MP_HOST_STR), orderId);
		oaMessage.message_url = String.format("%s/dingding/approval/approvalItem.html?approval.aid=%s", SystemConfig.getString(Constant.MP_HOST_STR), orderId);
		OAMessage.Head head = new OAMessage.Head();
		head.bgcolor = "FFDFD130";
		oaMessage.head = head;
		OAMessage.Body body = new OAMessage.Body();
		body.title = senderName;
		body.content = contents;
		body.author = senderName;
		
		oaMessage.body = body;
		
		appMessageDelivery.withMessage(oaMessage);
		
		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, SystemConfig.getString(Constant.OAPI_HOST_STR), accessToken);
		
		HttpHelper.httpPost(url, appMessageDelivery.toJsonObject());
		
		return 0;
	}
	
}
