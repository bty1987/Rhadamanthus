/**
 * @File Name     : QuotationAssignTalkServiceImpl.java
 * @Package       : com.fanglin.quotation.service.impl
 * @Version       : 1.0
 * @Date          : 2026-04-30
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 报价分配沟通消息 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.dao.QuotationAssignTalkDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.po.QuotationAssignTalkPO;
import com.fanglin.quotation.service.QuotationAssignTalkService;
import com.fanglin.quotation.vo.QuotationAssignTalkVO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.DateUtil;

/**
 * 报价分配沟通消息 Service 实现类
 *
 * <p>
 * 职责：处理设计师和预算员之间的沟通消息，包括消息持久化和钉钉消息通知
 * </p>
 *
 * @author Claude AI
 * @version 1.0
 */
@Service("quotationAssignTalkService")
@Transactional(readOnly = true)
public class QuotationAssignTalkServiceImpl implements QuotationAssignTalkService {

	@Autowired
	private QuotationAssignTalkDao quotationAssignTalkDao;

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DingTalkMessageService dingTalkMessageService;

	@Autowired
	private RoleDao roleDao;

	/**
	 * 高级权限角色级别阈值：level <= 此值视为高级权限，可查看所有消息
	 */
	private static final short ADVANCED_ROLE_LEVEL = 1;

	@Override
	public List<QuotationAssignTalkVO> queryQuotationAssignTalkByOrderId(String orderId, String userId, Integer roleId) throws FLException {

		// 判断是否高级权限（level <= ADVANCED_ROLE_LEVEL 或角色编号为 root）
		boolean isAdvanced = false;
		if (roleId != null && roleId > 0) {
			RolePO rolePO = roleDao.get(roleId);
			if (rolePO != null && (rolePO.getLevel() <= ADVANCED_ROLE_LEVEL || RolePO.SUPER_NO_STR.equals(rolePO.getNo()))) {
				isAdvanced = true;
			}
		}

		List<QuotationAssignTalkPO> talkPOs;

		if (isAdvanced) {
			// 高级权限：查看所有消息
			talkPOs = quotationAssignTalkDao.queryQuotationAssignTalkByOrderId(orderId);
		} else {
			// 普通用户：只能看到自己是发送人或接收人的消息
			UserPO currentUser = userDao.queryUserByUserId(userId);
			if (currentUser == null) {
				talkPOs = quotationAssignTalkDao.queryQuotationAssignTalkByOrderId(orderId);
			} else {
				talkPOs = quotationAssignTalkDao.queryQuotationAssignTalkByOrderIdAndUserId(orderId, currentUser.getUid());
			}
		}

		List<QuotationAssignTalkVO> talkVOs = new ArrayList<QuotationAssignTalkVO>();

		for (QuotationAssignTalkPO talkPO : talkPOs) {
			QuotationAssignTalkVO vo = new QuotationAssignTalkVO();
			vo.setSender(new UserBaseVO());
			vo.setReceiver(new UserBaseVO());
			talkVOs.add(talkPO.ptv(vo));
		}

		return talkVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignTalkVO sendQuotationAssignTalk(QuotationAssignTalkVO quotationAssignTalkVO, String senderUserId) throws FLException {

		// 空值检查
		if (quotationAssignTalkVO.getOrderId() == null || quotationAssignTalkVO.getOrderId().trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}
		if (quotationAssignTalkVO.getContent() == null || quotationAssignTalkVO.getContent().trim().isEmpty()) {
			throw new FLException(0, "消息内容不能为空");
		}
		if (senderUserId == null || senderUserId.trim().isEmpty()) {
			throw new FLException(0, "发送人不能为空");
		}

		// 查询发送人信息
		UserPO senderPO = userDao.queryUserByUserId(senderUserId);
		if (senderPO == null) {
			throw new FLException(0, "发送人信息不存在");
		}

		// 查询该装修单的分配请求，获取设计师和预算员信息
		QuotationAssignRequestPO requestPO = quotationAssignRequestDao.queryActiveByOrderId(quotationAssignTalkVO.getOrderId());

		// 确定消息类型和接收人
		short type = 0;
		UserPO receiver = null;
		int company = senderPO.getCompany();

		if (requestPO != null) {
			UserPO designer = requestPO.getRequestUser();
			UserPO budgeter = requestPO.getUser();

			// 判断发送人角色
			if (designer != null && designer.getUid() == senderPO.getUid()) {
				// 设计师发给预算员
				type = QuotationAssignTalkPO.TYPE_DESIGNER_TO_BUDGETER_INT;
				receiver = budgeter;
			} else if (budgeter != null && budgeter.getUid() == senderPO.getUid()) {
				// 预算员发给设计师
				type = QuotationAssignTalkPO.TYPE_BUDGETER_TO_DESIGNER_INT;
				receiver = designer;
			} else {
				// 发送人既不是设计师也不是预算员，默认作为设计师发送
				type = QuotationAssignTalkPO.TYPE_DESIGNER_TO_BUDGETER_INT;
				receiver = budgeter;
			}
		}

		// 创建PO对象
		QuotationAssignTalkPO talkPO = new QuotationAssignTalkPO();
		talkPO.setOrderId(quotationAssignTalkVO.getOrderId());
		talkPO.setContent(quotationAssignTalkVO.getContent());
		talkPO.setType(type);
		talkPO.setSender(senderPO);
		talkPO.setReceiver(receiver);

		// 设置时间
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		talkPO.setSendTime(currentTime);
		talkPO.setCreateTime(currentTime);

		// 保存消息
		quotationAssignTalkDao.save(talkPO);

		// 发送钉钉消息通知接收人
		if (receiver != null && receiver.getUserId() != null) {
			try {
				String dingMessage = String.format("【报价分配沟通】%s 发来消息：\n装修单号：%s\n内容：%s", senderPO.getCurrentName(), quotationAssignTalkVO.getOrderId(), quotationAssignTalkVO.getContent());
				dingTalkMessageService.sendDing(receiver.getUserId(), dingMessage, company);
			} catch (Exception e) {
				// 钉钉消息发送失败不影响主流程
			}
		}

		// 返回完整的VO
		QuotationAssignTalkVO resultVO = new QuotationAssignTalkVO();
		resultVO.setSender(new UserBaseVO());
		resultVO.setReceiver(new UserBaseVO());
		talkPO.ptv(resultVO);
		resultVO.setQatid(talkPO.getQatid());

		return resultVO;
	}
}
