/**
 * Title: MessageServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 */

package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.MessageUtil;
import com.fanglin.utils.Paging;

@Service("messageService")
@Transactional(readOnly = true)
public class MessageServiceImpl implements MessageService {

	@Autowired
	private MessageDao messageDao;
	
	@Override
	public void pageMessage(Paging paging, List<FilterVO> filters, String userId){
		List<MessagePO> messagePOs = messageDao.pageMessages(paging, filters, userId);
		List<MessageVO> messageVOs = new ArrayList<MessageVO>();
		
		for(MessagePO messagePO: messagePOs){
			messageVOs.add(convertBean(messagePO));
		}
		
		paging.setData(messageVOs);
	}
	
	@Override
	public List<MessageVO> queryMessageForUnRead(String userId){
		List<MessagePO> messagePOs = messageDao.queryMessageForUnreadByUserId(userId);
		List<MessageVO> messageVOs = new ArrayList<MessageVO>();
		
		for(MessagePO messagePO: messagePOs){
			messageVOs.add(convertBean(messagePO));
		}
		
		return messageVOs;
	}
	
	@Override
	public int countMessage(String userId){
		return messageDao.queryMessageCount(userId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void sendMessage(MessageVO messageVO) throws FLException{
		
		messageVO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		saveMessage(messageVO);
	}
	
	@Override
    @Transactional(rollbackFor=Exception.class)
    public void saveMessage(MessageVO messageVO){
		
		if(messageVO.getArgs() != null){
			Map<String, String> args = MessageUtil.getMapFromStr(messageVO.getArgs());
			String msgSerial = args.get("msgSerial");
			messageDao.updateApproveMsgSerial("msgSerial:" + msgSerial);
		}
		
	    MessagePO messagePO = new MessagePO();
	    
        BeanUtil.copyProperties(messageVO, messagePO, Arrays.asList("receiver", "sender"));
        
        messagePO.setReceiver(new UserPO());
        messagePO.setSender(new UserPO());
        
        BeanUtil.copyProperties(messageVO.getReceiver(), messagePO.getReceiver(), Arrays.asList("role", "dept"));
        BeanUtil.copyProperties(messageVO.getSender(), messagePO.getSender(), Arrays.asList("role", "dept"));
        
        messagePO.setStatus(MessagePO.MESSAGE_STATUS_UNREAD_STR);
        
        messageDao.save(messagePO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMessageForRead(List<Integer> ids){
		messageDao.updateMessageForRead(ids);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMessageById(MessageVO messageVO) throws FLException {
		
		List<String> unTypes = Arrays.asList(MessagePO.MESSAGE_TYPE_RETURN_STR, MessagePO.MESSAGE_TYPE_APPROVAL_STR, MessagePO.MESSAGE_TYPE_BUDGET_AUDIT_STR);
		
		MessagePO messagePO = messageDao.get(messageVO.getMessageId());
		
		if(messagePO != null){
			if(messagePO.getStatus() == MessagePO.MESSAGE_STATUS_UNREAD_STR){
				throw new FLException(160009, "消息未读,不能删除");
			}
			
			if(unTypes.contains(messagePO.getType())){
				throw new FLException(160010, "消息所属类型,不能删除");
			}
			
			messageDao.delete(messagePO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMessageByIds(List<Integer> ids){
		
		List<String> unTypes = Arrays.asList(MessagePO.MESSAGE_TYPE_RETURN_STR, MessagePO.MESSAGE_TYPE_APPROVAL_STR, MessagePO.MESSAGE_TYPE_BUDGET_AUDIT_STR);
		
		if(ids.size() > 0){
			messageDao.deleteMessageByIdAStatusAUnType(ids, MessagePO.MESSAGE_STATUS_READED_STR, unTypes);
		}
	}
	
	private MessageVO convertBean(MessagePO messagePO){
		MessageVO messageVO = new MessageVO();
		
		BeanUtil.copyProperties(messagePO, messageVO, Arrays.asList("receiver", "sender"));
		
		messageVO.setReceiver(new UserVO());
		messageVO.setSender(new UserVO());
		
		BeanUtil.copyProperties(messagePO.getReceiver(), messageVO.getReceiver(), Arrays.asList("role", "dept"));
		BeanUtil.copyProperties(messagePO.getSender(), messageVO.getSender(), Arrays.asList("role", "dept"));
		
		return messageVO;
	}

}
