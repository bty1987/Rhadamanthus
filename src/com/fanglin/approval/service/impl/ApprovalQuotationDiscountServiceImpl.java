/**
 * @File Name		: ApprovalQuotationDiscountServiceImpl.java
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
import com.fanglin.approval.dao.ApprovalQuotationDiscountDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalQuotationDiscountPO;
import com.fanglin.approval.service.ApprovalQuotationDiscountService;
import com.fanglin.approval.vo.ApprovalQuotationDiscountVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalQuotationDiscountService")
@Transactional(readOnly=true)
public class ApprovalQuotationDiscountServiceImpl implements ApprovalQuotationDiscountService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalQuotationDiscountDao approvalQuotationDiscountDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForQuotationDiscount(ApprovalVO approvalVO, ApprovalQuotationDiscountVO approvalQuotationDiscountVO, String userId, int company) throws FLException {
		
		List<Short> status = Arrays.asList(new Short[]{DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_RESIGNED_INT, DecorationPO.STATUS_RESIGNED_INT});
		
		String orderId = approvalQuotationDiscountVO.getOrderId();
		
		Long quotationId = approvalQuotationDiscountVO.getQid();
		
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_QUOTATION_DISCOUNT_INT, String.valueOf(quotationId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(!status.contains(decorationPO.getStatus())){
			throw new FLException(200007, "订单合同已签订不可折扣修改");
		}
		
		QuotationPO quotationPO = quotationDao.get(quotationId);
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		approvalPO = new ApprovalPO();
		
		BeanUtil.copyProperties(approvalVO, approvalPO,Arrays.asList("receiver","sender"));
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_QUOTATION_DISCOUNT_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(quotationId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_QUOTATION_DISCOUNT_STR, orderId, String.valueOf(quotationId), quotationPO.getDiscount(), approvalQuotationDiscountVO.getNewDiscount()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalQuotationDiscountPO approvalQuotationDiscountPO = new ApprovalQuotationDiscountPO();
		BeanUtil.copyProperties(approvalQuotationDiscountVO, approvalQuotationDiscountPO);
		
		approvalQuotationDiscountPO.setAid(approvalPO.getAid());
		approvalQuotationDiscountPO.setOldDiscount(quotationPO.getDiscount());
		
		approvalQuotationDiscountDao.save(approvalQuotationDiscountPO);

		messageService.sendMessage(approvalPO.getReceiver().getUserId(),approvalPO.getSender().getUserId(),approvalPO.getContents(), MessagePO.MESSAGE_TYPE_SEND_APPROVAL_STR,company);	

	return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForQuotationDiscount(ApprovalPO approvalPO) throws FLException {
		
		ApprovalQuotationDiscountPO approvalQuotationDiscountPO = approvalQuotationDiscountDao.queryApprovalQuotationDiscountByAId(approvalPO.getAid());
		
		if(approvalQuotationDiscountPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(approvalQuotationDiscountPO.getOrderId());
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<Short> status = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT);
		
		if(!status.contains(decorationPO.getStatus())){
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
			approvalPO.setComment(String.format("%s 订单状态:%s,不支持该操作通过.", approvalPO.getComment(), decorationPO.getStatus()));
		}else{
			QuotationPO quotationPO = quotationDao.get(approvalQuotationDiscountPO.getQid());
			
			if(quotationPO == null){
				throw new FLException(200003, "报价不存在");
			}
			
			if(!status.contains(decorationPO.getStatus())){
				throw new FLException(200005, "报价不能修改");
			}
			
			quotationPO.setDiscount(approvalQuotationDiscountPO.getNewDiscount());
			
			if(quotationPO.getDefaults() == QuotationPO.DEFAULTS_DEFAULT_SHORT){
				decorationPO.setDiscount(quotationPO.getDiscount());
				
				decorationDao.update(decorationPO);
			}
			
			quotationDao.update(quotationPO);
		}		
		return 0;
	}

}
