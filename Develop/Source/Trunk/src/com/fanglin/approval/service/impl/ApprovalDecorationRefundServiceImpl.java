/**
 * @File Name		: ApprovalDecorationRefundServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationRefundDao;
import com.fanglin.approval.po.ApprovalDecorationRefundPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationRefundService;
import com.fanglin.approval.vo.ApprovalDecorationRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationRefundService")
@Transactional(readOnly=true)
public class ApprovalDecorationRefundServiceImpl implements ApprovalDecorationRefundService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalDecorationRefundDao approvalDecorationRefundDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForDecorationRefund(ApprovalVO approvalVO, ApprovalDecorationRefundVO approvalDecorationRefundVO, String userId) throws FLException {
		
		long paymentId = approvalDecorationRefundVO.getPaymentId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT, String.valueOf(paymentId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(approvalDecorationRefundVO.getPaymentId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!decorationOrderPO.getPaymentStatus().equals(decorationPaymentPO.getPaymentType())){
			throw new FLException(240005, "退款类型与订单收款信息不符");
		}
		
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_APPLY_STR);
		
		decorationPaymentDao.update(decorationPaymentPO);
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(paymentId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_DECORATION_REFUND_STR, decorationPaymentPO.getDecorationOrderPO().getOrderId(), decorationPaymentPO.getPaymentType(), decorationPaymentPO.getReferMoney()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		
		approvalDao.save(approvalPO);
		
		ApprovalDecorationRefundPO approvalDecorationRefundPO = new ApprovalDecorationRefundPO();
		approvalDecorationRefundPO.setAid(approvalPO.getAid());
		approvalDecorationRefundPO.setPaymentId(paymentId);
		
		approvalDecorationRefundDao.save(approvalDecorationRefundPO);
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForDecorationRefund(ApprovalPO approvalPO) throws FLException {
		
		List<String> completePaymentType = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});
		List<String> offplanPaymentType = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});
		
		ApprovalDecorationRefundPO approvalDecorationRefundPO = approvalDecorationRefundDao.queryApprovalDecorationRefundByAId(approvalPO.getAid());
		
		if(approvalDecorationRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(approvalDecorationRefundPO.getPaymentId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		DecorationPaymentPO decorationRefundPO = new DecorationPaymentPO();
		decorationRefundPO.setDecorationOrderPO(decorationPaymentPO.getDecorationOrderPO());
		decorationRefundPO.setPaymentType(decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_REFUND_STR);
		decorationRefundPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
		decorationRefundPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationRefundPO.setCreateUserPO(approvalPO.getSender());
		decorationRefundPO.setReferMoney(decorationPaymentPO.getReferMoney());
		
		DecorationPaymentPO initialDecorationPaymentPO = new DecorationPaymentPO();
		BeanUtil.copyProperties(decorationRefundPO, initialDecorationPaymentPO);
		
		initialDecorationPaymentPO.setPaymentType(decorationPaymentPO.getPaymentType());
		
		decorationPaymentDao.save(decorationRefundPO);
		decorationPaymentDao.save(initialDecorationPaymentPO);
		
		decorationPaymentPO.setPaymentType(decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_HISTORY_STR);
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PASS_STR);
		
		decorationPaymentDao.update(decorationPaymentPO);
		
		int paymentStatusIndex = 0;
		
		if(DecorationOrderPO.HOUSETYPE_COMPLETE_STR.equals(decorationOrderPO.getHouseType())){
			paymentStatusIndex = completePaymentType.indexOf(decorationOrderPO.getPaymentStatus());
			
			decorationOrderPO.setPaymentStatus(paymentStatusIndex > 0 ? completePaymentType.get(paymentStatusIndex - 1) : null);
		}else if(DecorationOrderPO.HOUSETYPE_OFFPLAN_STR.equals(decorationOrderPO.getHouseType())){
			paymentStatusIndex = offplanPaymentType.indexOf(decorationOrderPO.getPaymentStatus());
			
			decorationOrderPO.setPaymentStatus(paymentStatusIndex > 0 ? offplanPaymentType.get(paymentStatusIndex - 1) : null);
		}
		
		decorationOrderDao.update(decorationOrderPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseForDecorationRefund(ApprovalPO approvalPO) throws FLException {
		
		ApprovalDecorationRefundPO approvalDecorationRefundPO = approvalDecorationRefundDao.queryApprovalDecorationRefundByAId(approvalPO.getAid());
		
		if(approvalDecorationRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(approvalDecorationRefundPO.getPaymentId());
		
		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR);
		
		decorationPaymentDao.update(decorationPaymentPO);
		
		return 0;
	}

}
