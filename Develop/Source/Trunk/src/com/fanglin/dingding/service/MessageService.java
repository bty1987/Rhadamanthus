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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.po.AppMessageDelivery;
import com.fanglin.dingding.po.OAMessage;
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
	
	public  int sendMessage(String receiveId, String senderName, String contents,Integer company){
	
		String accessToken =authDDService.getAccessToken(FormatUtil.encodeCompany(company));
	
		SystemConfigPO messageAgentId = systemConfigDao.querySystemConfig("messageAgentId", company);
		
		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", messageAgentId.getValue());
		
		OAMessage oaMessage = new OAMessage();
		
		OAMessage.Head head = new OAMessage.Head();
		head.bgcolor = "FFDFD130";
		oaMessage.head = head;
		OAMessage.Body body = new OAMessage.Body();
	
		body.content ="内容  : "+contents;
		body.author = "发送人 : "+senderName;
		
		oaMessage.body = body;
		
		appMessageDelivery.withMessage(oaMessage);
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		
		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, oapiHost.getValue() , accessToken);
		
		JSONObject json = HttpHelper.httpPost(url, appMessageDelivery.toJsonObject());
		
		int errcode=json.getInteger("errcode");
	 	
		return errcode; 
		
	}
	
	

	
}
