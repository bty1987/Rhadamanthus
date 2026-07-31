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
	private com.fanglin.dingding.service.DingTalkMessageService messageDDService;

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
	public MessageVO queryMessageByMid(MessageVO message) {

		MessagePO messagePO = messageDao.get(message.getMid());
		MessageVO messageVO = convertBean(messagePO);

		return messageVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendMessage(MessageVO messageVO, int company) throws FLException {

		if (messageVO.getSender() != null) {
			sendMessage(messageVO.getReceiver().getUserId(), messageVO.getSender().getUserId(), messageVO.getContents(), messageVO.getType(), company);
		} else {
			sendMessage(messageVO.getReceiver().getUserId(), "", messageVO.getContents(), messageVO.getType(), company);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendMessage(String receiver, String sender, String contents, short type, int company) throws FLException {

		MessagePO messagePO = saveMessage(receiver, sender, contents, type, company);

		messageDDService.sendMessage(receiver, getSenderName(messagePO), contents, messagePO.getMid(), company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendMessageForUrl(String receiver, String sender, String contents, short type, String messageUrl, int company) throws FLException {

		MessagePO messagePO = saveMessage(receiver, sender, contents, type, company);

		messageDDService.sendMessageForUrl(receiver, getSenderName(messagePO), contents, messageUrl, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendMessage(String receiver, String sender, String contents, short type, short subtype, long ident, int company) throws FLException {

		MessagePO messagePO = new MessagePO();

		messagePO.setReceiver(userDao.queryUserByUserId(receiver));
		messagePO.setType(type);
		messagePO.setIdent(ident);
		messagePO.setSubtype(subtype);
		messagePO.setContents(contents);
		messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		messagePO.setStatus(MessagePO.STATUS_UNREAD_INT);
		messagePO.setCompany(company);

		String userName = "";

		if (sender != null && !sender.equals("")) {
			UserPO userPO = userDao.queryUserByUserId(sender);
			userName = userPO.getUserName();
			messagePO.setSender(userPO);
		}

		messageDao.save(messagePO);

		messageDDService.sendMessage(receiver, userName, contents, messagePO.getMid(), company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMessageForRead(List<Integer> ids) {
		messageDao.updateMessageForRead(ids);
	}

	private MessagePO saveMessage(String receiver, String sender, String contents, short type, int company) {

		MessagePO messagePO = new MessagePO();

		messagePO.setReceiver(userDao.queryUserByUserId(receiver));
		messagePO.setType(type);
		messagePO.setContents(contents);
		messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		messagePO.setStatus(MessagePO.STATUS_UNREAD_INT);
		messagePO.setCompany(company);

		if (sender != null && !sender.equals("")) {
			messagePO.setSender(userDao.queryUserByUserId(sender));
		}

		messageDao.save(messagePO);

		return messagePO;
	}

	private String getSenderName(MessagePO messagePO) {

		return messagePO.getSender() == null ? "" : messagePO.getSender().getUserName();
	}

	private MessageVO convertBean(MessagePO messagePO) {

		MessageVO messageVO = new MessageVO();

		BeanUtil.copyProperties(messagePO, messageVO, Arrays.asList("receiver", "sender"));

		messageVO.setReceiver(new UserVO().setBaseInfo(messagePO.getReceiver()));
		messageVO.setSender(new UserVO().setBaseInfo(messagePO.getSender()));

		return messageVO;
	}
}
