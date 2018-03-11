package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("messageService")
@Transactional(readOnly = true)
public class MessageServiceImpl implements MessageService {

	@Autowired
	private MessageDao messageDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private com.fanglin.dingding.service.MessageService messageDDService;

	@Override
	public void pageMessage(Paging paging, List<Filter> filters, String userId, int company) {
		List<MessagePO> messagePOs = messageDao.pageMessages(paging, filters, userId, company);
		List<MessageVO> messageVOs = new ArrayList<MessageVO>();

		for (MessagePO messagePO : messagePOs) {
			messageVOs.add(convertBean(messagePO));
		}

		paging.setData(messageVOs);
	}

	@Override
	public int countMessage(String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		return messageDao.queryMessageCount(userPO.getUid(), company);
	}

	@Override
	public List<MessageVO> queryMessageForUnRead(String userId, int company) {
		List<MessagePO> messagePOs = messageDao.queryMessageForUnreadByUserId(userId, company);
		List<MessageVO> messageVOs = new ArrayList<MessageVO>();

		for (MessagePO messagePO : messagePOs) {
			messageVOs.add(convertBean(messagePO));
		}

		return messageVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendMessage(MessageVO messageVO, int company) throws FLException {

		MessagePO messagePO = new MessagePO();

		messagePO.setReceiver(userDao.queryUserByUserId(messageVO.getReceiver().getUserId()));
		messagePO.setType(messageVO.getType());
		messagePO.setContents(messageVO.getContents());
		messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		messagePO.setStatus(MessagePO.MESSAGE_STATUS_UNREAD_STR);
		messagePO.setCompany(company);

		int error;
		short errorCode = MessagePO.MESSAGE_DRESULT_FAIL_STR;

		if (messageVO.getSender() != null) {
			UserPO send = userDao.queryUserByUserId(messageVO.getSender().getUserId());
			messagePO.setSender(send);
			error = messageDDService.sendMessage(messageVO.getReceiver().getUserId(), send.getUserName(), messageVO.getContents(), company);
		} else {
			error = messageDDService.sendMessage(messageVO.getReceiver().getUserId(), "", messageVO.getContents(), company);
		}

		if (error == 0) {
			errorCode = MessagePO.MESSAGE_DRESULT_SUCCESS_STR;
		}

		messagePO.setDresult(errorCode);

		messageDao.save(messagePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendMessage(String receiver, String sender, String contents, short type, int company) throws FLException {

		MessagePO messagePO = new MessagePO();

		messagePO.setReceiver(userDao.queryUserByUserId(receiver));
		messagePO.setType(type);
		messagePO.setContents(contents);
		messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		messagePO.setStatus(MessagePO.MESSAGE_STATUS_UNREAD_STR);
		messagePO.setCompany(company);

		int error;
		String userName = "";
		short errorCode = MessagePO.MESSAGE_DRESULT_FAIL_STR;
		UserPO userPO = userDao.queryUserByUserId(sender);

		if (userPO != null) {
			userName = userPO.getUserName();
			messagePO.setSender(userPO);
		}

		error = messageDDService.sendMessage(receiver, userName, contents, company);

		if (error == 0) {
			errorCode = MessagePO.MESSAGE_DRESULT_SUCCESS_STR;
		}

		messagePO.setDresult(errorCode);
		messageDao.save(messagePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMessageForRead(List<Integer> ids) {

		messageDao.updateMessageForRead(ids);
	}

	private MessageVO convertBean(MessagePO messagePO) {
		MessageVO messageVO = new MessageVO();

		BeanUtil.copyProperties(messagePO, messageVO, Arrays.asList("receiver", "sender"));

		UserVO receiver = new UserVO();

		UserPO _receiver = messagePO.getReceiver();

		receiver.setUserName(_receiver.getUserName());
		receiver.setCurrentName(_receiver.getCurrentName());
		receiver.setUserId(_receiver.getUserId());

		messageVO.setReceiver(receiver);

		UserVO sender = new UserVO();
		if (messagePO.getSender() != null) {
			UserPO _sender = messagePO.getSender();
			sender.setUserName(_sender.getUserName());
			sender.setCurrentName(_sender.getCurrentName());
			sender.setUserId(_sender.getUserId());
			messageVO.setSender(sender);
		}

		return messageVO;
	}

}
