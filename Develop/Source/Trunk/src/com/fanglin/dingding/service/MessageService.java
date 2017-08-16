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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.dingding.po.AppMessageDelivery;
import com.fanglin.dingding.po.OAMessage;
import com.fanglin.dingding.po.TextMessage;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;

@Service("messageDDService")
@Transactional(readOnly = true)
public class MessageService {
	
	@Autowired
	private   AuthService authDDService ;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	public  int send(AppMessageDelivery delivery,Integer company){
		
		Logger logger = LoggerFactory.getLogger(MessageService.class);
		
		try {
			String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));
			
			SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
			
			String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR,oapiHost.getValue(), accessToken);
			
			HttpHelper.httpPost(url, delivery.toJsonObject());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		return 0;
	}
	
	public  int sendMessageForApproval(String receiveId, String senderName, int approvalId, String type, String contents,Integer company){
		
		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));
		
		SystemConfigPO messageAgentId = systemConfigDao.querySystemConfig("messageAgentId", company);
		
		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
		
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", messageAgentId.getValue());
		
		OAMessage oaMessage = new OAMessage();
		oaMessage.message_url = String.format("%s/dingding/approval/approvalItem.html?approval.aid=%s",isv.getValue(), approvalId);
		OAMessage.Head head = new OAMessage.Head();
		head.bgcolor = "FFE8643E";
		oaMessage.head = head;
		OAMessage.Body body = new OAMessage.Body();
		body.title = type;
		body.content = contents;
		body.author = senderName;
		
		oaMessage.body = body;
		
		appMessageDelivery.withMessage(oaMessage);
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		
		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, oapiHost.getValue() , accessToken);
		
		HttpHelper.httpPost(url, appMessageDelivery.toJsonObject());
		
		return 0;
	}
	
	public  int sendMessageForPayment(String receiveId, String senderName, String contents,Integer company){
		
		TextMessage textMessage = new TextMessage(contents);
		
		SystemConfigPO messageAgentId = systemConfigDao.querySystemConfig("messageAgentId", company);
	
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "",messageAgentId.getValue());
		
		appMessageDelivery.withMessage(textMessage);
		
		send(appMessageDelivery,company);
		
		return 0;
	}
	
	public  int sendMessageForBackVisit(String receiveId, String senderName, String orderId, String contents,Integer company){
		
		String accessToken =authDDService.getAccessToken(FormatUtil.encodeCompany(company));
		
		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
		
		SystemConfigPO messageAgentId = systemConfigDao.querySystemConfig("messageAgentId", company);
		
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", messageAgentId.getValue());
		
		OAMessage oaMessage = new OAMessage();
		oaMessage.message_url = String.format("%s/dingding/salesman/backvisit.html?orderid=%s",isv.getValue(), orderId);
		OAMessage.Head head = new OAMessage.Head();
		head.bgcolor = "FFDFD130";
		oaMessage.head = head;
		OAMessage.Body body = new OAMessage.Body();
		body.title = senderName;
		body.content = contents;
		body.author = senderName;
		
		oaMessage.body = body;
		
		appMessageDelivery.withMessage(oaMessage);
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		
		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, oapiHost.getValue(), accessToken);
		
		HttpHelper.httpPost(url, appMessageDelivery.toJsonObject());
		
		return 0;
	}
	 	
	public  int sendMessage(String receiveId, String senderName, String contents,Integer company){
		
		TextMessage textMessage = new TextMessage(contents);
			
		SystemConfigPO messageAgentId = systemConfigDao.querySystemConfig("messageAgentId", company);
	
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "",messageAgentId.getValue());
			
		appMessageDelivery.withMessage(textMessage);
			
		send(appMessageDelivery,company);
			
		return 0;
	}
	
	
}
