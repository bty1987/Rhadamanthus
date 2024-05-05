package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ConversationDao;
import com.fanglin.customer.dao.DroupDao;
import com.fanglin.customer.po.ConversationPO;
import com.fanglin.customer.po.DroupPO;
import com.fanglin.customer.service.ConversationService;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.vo.ConversationVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.bean.AppMessage;
import com.fanglin.dingding.bean.Group;
import com.fanglin.dingding.bean.ImageMessage;
import com.fanglin.dingding.bean.TextMessage;
import com.fanglin.dingding.bean.VoiceMessage;
import com.fanglin.dingding.service.GroupService;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("conversationService")
@Transactional(readOnly = true)
public class ConversationServiceImpl implements ConversationService {

	@Autowired
	private ConversationDao conversationDao;

	@Autowired
	private DroupDao droupDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userdDao;

	@Autowired
	private GroupService groupService;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageConversation(Paging paging, List<Filter> filters) {

		List<ConversationPO> conversationPOs = conversationDao.pageConversation(paging, filters);
		List<ConversationVO> conversationVOs = new ArrayList<ConversationVO>();

		for (ConversationPO conversationPO : conversationPOs) {

			ConversationVO conversationVO = new ConversationVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));
			BeanUtil.copyProperties(conversationPO, conversationVO, Arrays.asList("creater"));
			if (conversationPO.getCreater() != null) {
				BeanUtil.copyProperties(conversationPO.getCreater(), conversationVO.getCreater(), Arrays.asList("dept", "role", "duty"));
				BeanUtil.copyProperties(conversationPO.getCreater().getDept(), conversationVO.getCreater().getDept(), Arrays.asList("fatherDept", "type", "manager"));
				BeanUtil.copyProperties(conversationPO.getCreater().getDuty(), conversationVO.getCreater().getDuty(), Arrays.asList("departmentType"));
			}

			conversationVOs.add(conversationVO);
		}

		paging.setData(conversationVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void requestConversation(ConversationVO conversationVO, String userId) throws FLException {

		DroupPO droupPO = null;

		if (conversationVO.getChatId() != null) {
			droupPO = droupDao.queryDroup(null, conversationVO.getChatId(), null);
		}

		String orderId = conversationVO.getOrderId();

		if (droupPO == null && orderId != null) {
			droupPO = droupDao.queryDroup(orderId, null, null);
		}

		if (droupPO == null) {
			throw new FLException(330067, "群信息不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(droupPO.getDecoration().getOrderId());

		UserPO creater = userdDao.queryUserByUserId(userId);

		ConversationPO conversationPO = new ConversationPO(creater);

		BeanUtil.copyProperties(conversationVO, conversationPO, Arrays.asList("creater"));

		conversationPO.setOrderId(decorationPO.getOrderId());
		conversationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		conversationPO.setAtttype(ConversationPO.ATTTYPE_REQU_INT);

		conversationDao.save(conversationPO);

		droupPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		droupPO.setIsHandle(DroupPO.ISHANDLE_REQU_INT);

		droupDao.save(droupPO);

		conversationVO.setCreater(new UserBaseVO());

		BeanUtil.copyProperties(conversationPO, conversationVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(conversationPO.getCreater(), conversationVO.getCreater(), Arrays.asList("dept", "role", "duty"));

		if (droupPO.getType() != 1) return;

		Group group = new Group(droupPO.getChatId(), droupPO.getOpenId());

		JSONObject message = null;

		if (conversationPO.getType() == ConversationPO.TYPE_TEXT_INT) {
			message = new TextMessage(conversationPO.getContent()).delivery();
		}

		if (conversationPO.getType() == ConversationPO.TYPE_IMAGE_INT) {
			message = new ImageMessage(String.format("http://www.fanglinserver.com/%s", conversationPO.getPath())).delivery();
		}

		if (conversationPO.getType() == ConversationPO.TYPE_APP_INT) {
			message = new AppMessage(conversationPO.getContent(), String.format("http://www.fanglinserver.com/test/dingding/decoration/decorationorder.html?orderId=%s", conversationPO.getOrderId()), "查看更多").delivery();
		}

		if (conversationPO.getType() == ConversationPO.TYPE_VOICE_INT) {
			message = new VoiceMessage(conversationVO.getContent(), conversationVO.getWidth()).delivery();
		}

		groupService.send(group, message, decorationPO.getCompany());

		if (conversationVO.getFocuser().getUserId() != null && !conversationVO.getFocuser().getUserId().equals("")) {

			UserPO focuser = userdDao.queryUserByUserId(conversationVO.getFocuser().getUserId());
			messageService.sendMessage(conversationVO.getFocuser().getUserId(), "", conversationVO.getContent(), MessagePO.TYPE_SEND_PERSONEL_INT, focuser.getCompany());
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void responseConversation(ConversationVO conversationVO, String userId) throws FLException {

		if (conversationVO.getCreater() != null && conversationVO.getCreater().getUserId() != null) {
			userId = conversationVO.getCreater().getUserId();
		}

		UserPO creater = userdDao.queryUserByUserId(userId);

		String orderId = conversationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DroupPO droupPO = droupDao.queryDroup(orderId, null, null);

		if (droupPO == null) {

			throw new FLException(330067, "群信息不存在");
		}

		ConversationPO conversationPO = new ConversationPO(creater);

		BeanUtil.copyProperties(conversationVO, conversationPO, Arrays.asList("creater"));

		conversationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		conversationPO.setAtttype(ConversationPO.ATTTYPE_RESP_INT);

		conversationDao.save(conversationPO);

		droupPO.setHandleTime(DateUtil.getDateToTimestamp(new Date()));

		droupPO.setIsHandle(DroupPO.ISHANDLE_RESP_INT);

		droupPO.setIsRead(DroupPO.ISREAD_RESP_INT);

		droupDao.save(droupPO);

		conversationVO.setCreater(new UserBaseVO());

		BeanUtil.copyProperties(conversationPO, conversationVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(conversationPO.getCreater(), conversationVO.getCreater(), Arrays.asList("dept", "role", "duty"));

		Group group = new Group(droupPO.getChatId(), droupPO.getOpenId());

		JSONObject message = null;

		if (conversationPO.getType() == ConversationPO.TYPE_TEXT_INT) {
			message = new TextMessage(conversationPO.getContent()).delivery();
		}

		if (conversationPO.getType() == ConversationPO.TYPE_IMAGE_INT) {
			message = new ImageMessage(String.format("http://www.fanglinserver.com/%s", conversationPO.getPath())).delivery();
		}

		if (conversationPO.getType() == ConversationPO.TYPE_APP_INT) {
			message = new AppMessage(conversationPO.getContent(), String.format("http://www.fanglinserver.com/test/dingding/decoration/decorationorder.html?orderId=%s", conversationPO.getOrderId()), "查看更多").delivery();
		}

		groupService.send(group, message, decorationPO.getCompany());

		String content = String.format("装修单号:%s, 有一条新消息, 请查收.", orderId);

		decorationService.sendMessage(orderId, "消息提醒", content, String.format("pages/customer/conversation/conversation?orderId=%s", orderId));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConversation(ConversationVO conversationVO) {

		ConversationPO conversationPO = conversationDao.get(conversationVO.getCid());

		conversationDao.delete(conversationPO);

		return 0;
	}

}
