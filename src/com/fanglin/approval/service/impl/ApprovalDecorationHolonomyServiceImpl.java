package com.fanglin.approval.service.impl;

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
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForDecorationHolonomy(ApprovalVO approvalVO, ApprovalDecorationHolonomyVO approvalDecorationHolonomyVO, String userId, int company) throws FLException {
		
		String orderId = approvalDecorationHolonomyVO.getOrderId();
		
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_TYPE_DECORATION_HOLONOMY_INT, String.valueOf(orderId));
		
		if(approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		String content = String.format("订单号:%s,主材配比额:%s,修改为主材配比额:%s", orderId, decorationHolonomyPO.getMaterialPrice(), approvalDecorationHolonomyVO.getMaterialPrice());
		
		approvalPO = new ApprovalPO().init(sender, receiver, orderId, ApprovalPO.APPROVAL_TYPE_DECORATION_HOLONOMY_INT, content, company);
		
		approvalDao.save(approvalPO);
		
		ApprovalDecorationHolonomyPO approvalDecorationHolonomyPO = new ApprovalDecorationHolonomyPO();	
		BeanUtil.copyProperties(approvalDecorationHolonomyVO, approvalDecorationHolonomyPO);
		
		approvalDecorationHolonomyPO.setAid(approvalPO.getAid());
		
		approvalDecorationHolonomyDao.save(approvalDecorationHolonomyPO);
		
		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForApprovalForDecorationHolonomy(ApprovalPO approvalPO) throws FLException {
		
		ApprovalDecorationHolonomyPO approvalDecorationHolonomyPO = approvalDecorationHolonomyDao.queryApprovalDecorationHolonomyByAId(approvalPO.getAid());
		
		if(approvalDecorationHolonomyPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(approvalDecorationHolonomyPO.getOrderId());
		
		decorationHolonomyPO.setMaterialPrice(approvalDecorationHolonomyPO.getMaterialPrice());
		
		decorationHolonomyDao.update(decorationHolonomyPO);
		
		return 0;
	}

}
