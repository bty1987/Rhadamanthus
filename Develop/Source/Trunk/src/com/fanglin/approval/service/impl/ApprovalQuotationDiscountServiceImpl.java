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
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Service("approvalQuotationDiscountService")
@Transactional(readOnly=true)
public class ApprovalQuotationDiscountServiceImpl implements ApprovalQuotationDiscountService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalQuotationDiscountDao approvalQuotationDiscountDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForQuotationDiscount(ApprovalVO approvalVO, ApprovalQuotationDiscountVO approvalQuotationDiscountVO, String userId, short level, int company) throws FLException {
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR, DecorationOrderPO.STATUS_RESIGNED_STR});
		
		String approvalDuty = "";
		String orderId = approvalQuotationDiscountVO.getOrderId();
		Long quotationId = approvalQuotationDiscountVO.getQuotationId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_QUOTATION_DISCOUNT_INT, String.valueOf(quotationId));
		
		if(approvalPO != null && level == ApprovalPO.APPROVAL_QUOTATION_DISCOUNT_LEVEL_ONE_INT){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(!status.contains(decorationOrderPO.getStatus())){
			throw new FLException(200007, "订单合同已签订不可折扣修改");
		}
		
		QuotationPO quotationPO = quotationDao.get(quotationId);
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		List<UserPO> userPOs = null;
		UserPO userPO = decorationOrderPO.getDesignerPO();
		UserPO sender = userDao.queryUserByUserId(userId);
		if(level == ApprovalPO.APPROVAL_QUOTATION_DISCOUNT_LEVEL_ONE_INT){
			approvalDuty = "设计部经理";
			
			userPOs = userDao.queryUserByDeptIdADuty(userPO.getDept().getDeptId(), approvalDuty);
		}else if(level == ApprovalPO.APPROVAL_QUOTATION_DISCOUNT_LEVEL_TWO_INT){
			approvalDuty = "设计部总监";
			
			userPOs = userDao.queryUserByDeptIdADuty(userPO.getDept().getFatherDept().getDeptId(), approvalDuty);
		}
		
		if(userPOs == null || userPOs.size() == 0){
			throw new FLException(200008, "审批信息错误,没有" + approvalDuty);
		}
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_QUOTATION_DISCOUNT_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(quotationId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_QUOTATION_DISCOUNT_STR, orderId, String.valueOf(quotationId), quotationPO.getDiscount(), approvalQuotationDiscountVO.getNewDiscount(), level));
		approvalPO.setReceiver(userPOs.get(0));
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalQuotationDiscountPO approvalQuotationDiscountPO = new ApprovalQuotationDiscountPO();
		BeanUtil.copyProperties(approvalQuotationDiscountVO, approvalQuotationDiscountPO);
		
		approvalQuotationDiscountPO.setAid(approvalPO.getAid());
		approvalQuotationDiscountPO.setOldDiscount(quotationPO.getDiscount());
		approvalQuotationDiscountPO.setLevel(level);
		
		approvalQuotationDiscountDao.save(approvalQuotationDiscountPO);
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForQuotationDiscount(ApprovalPO approvalPO) throws FLException {
		
		ApprovalQuotationDiscountPO approvalQuotationDiscountPO = approvalQuotationDiscountDao.queryApprovalQuotationDiscountByAId(approvalPO.getAid());
		
		if(approvalQuotationDiscountPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(approvalQuotationDiscountPO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<String> status = Arrays.asList(DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR);
		
		Float limitDiscount = SystemConfig.getFloat("defaultSecondApprovalDiscount", 8f);
		
		if(!status.contains(decorationOrderPO.getStatus())){
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
			approvalPO.setComment(String.format("%s 订单状态:%s,不支持该操作通过.", approvalPO.getComment(), decorationOrderPO.getStatus()));
		}else{
			if(approvalQuotationDiscountPO.getLevel() == ApprovalPO.APPROVAL_QUOTATION_DISCOUNT_LEVEL_ONE_INT && approvalQuotationDiscountPO.getNewDiscount() < limitDiscount){
				ApprovalVO approvalVO = new ApprovalVO();
				approvalVO.setComment(approvalPO.getComment());
				
				ApprovalQuotationDiscountVO approvalQuotationDiscountVO = new ApprovalQuotationDiscountVO();
				approvalQuotationDiscountVO.setOrderId(approvalQuotationDiscountPO.getOrderId());
				approvalQuotationDiscountVO.setQuotationId(approvalQuotationDiscountPO.getQuotationId());
				approvalQuotationDiscountVO.setNewDiscount(approvalQuotationDiscountPO.getNewDiscount());
				
				submitApprovalForQuotationDiscount(approvalVO, approvalQuotationDiscountVO, approvalPO.getSender().getUserId(), ApprovalPO.APPROVAL_QUOTATION_DISCOUNT_LEVEL_TWO_INT,approvalPO.getCompany());
			}else{
				QuotationPO quotationPO = quotationDao.get(approvalQuotationDiscountPO.getQuotationId());
				
				if(quotationPO == null){
					throw new FLException(200003, "报价不存在");
				}
				
				quotationPO.setDiscount(approvalQuotationDiscountPO.getNewDiscount());
				quotationDao.update(quotationPO);
			}
		}
		
		return 0;
	}

}
