package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationHolonomyDao;
import com.fanglin.approval.po.ApprovalDecorationHolonomyPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationHolonomyService;
import com.fanglin.approval.vo.ApprovalDecorationHolonomyVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("approvalDecorationHolonomyService")
@Transactional(readOnly = true)
public class ApprovalDecorationHolonomyServiceImpl implements ApprovalDecorationHolonomyService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalDecorationHolonomyDao approvalDecorationHolonomyDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationHolonomy(ApprovalVO approvalVO, ApprovalDecorationHolonomyVO approvalDecorationHolonomyVO, String userId, int company) throws FLException {

		String orderId = approvalDecorationHolonomyVO.getOrderId();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_DECORATION_HOLONOMY_INT, orderId);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);

		String content = String.format("装修单号:%s,主材配比额:%.3f,修改为主材配比额:%.3f", orderId, Arith.div(decorationHolonomyPO.getMaterialPrice(), 1000.0), Arith.div(approvalDecorationHolonomyVO.getMaterialPrice(), 1000.0));

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, orderId, ApprovalPO.APPROVAL_TYPE_DECORATION_HOLONOMY_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalDecorationHolonomyPO approvalDecorationHolonomyPO = new ApprovalDecorationHolonomyPO();
		BeanUtil.copyProperties(approvalDecorationHolonomyVO, approvalDecorationHolonomyPO);

		approvalDecorationHolonomyPO.setAid(approvalPO.getAid());

		approvalDecorationHolonomyDao.save(approvalDecorationHolonomyPO);

		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForDecorationHolonomy(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationHolonomyPO approvalDecorationHolonomyPO = approvalDecorationHolonomyDao.queryApprovalDecorationHolonomyByAId(approvalPO.getAid());

		if (approvalDecorationHolonomyPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(approvalDecorationHolonomyPO.getOrderId());

		decorationHolonomyPO.setMaterialPrice(approvalDecorationHolonomyPO.getMaterialPrice());

		decorationHolonomyDao.update(decorationHolonomyPO);

		return 0;
	}

}
