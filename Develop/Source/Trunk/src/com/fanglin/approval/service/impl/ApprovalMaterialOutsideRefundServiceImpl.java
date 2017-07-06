/**
 * @File Name		: ApprovalMaterialOutsideRefundServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalMaterialOutsideRefundDao;
import com.fanglin.approval.po.ApprovalMaterialOutsideRefundPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalMaterialOutsideRefundService;
import com.fanglin.approval.vo.ApprovalMaterialOutsideRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.dao.MaterialOutsideDao;
import com.fanglin.material.po.MaterialOutsidePO;
import com.fanglin.payment.dao.MaterialOutsidePaymentDao;
import com.fanglin.payment.po.MaterialOutsidePaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalMaterialOutsideRefundService")
@Transactional(readOnly=true)
public class ApprovalMaterialOutsideRefundServiceImpl implements ApprovalMaterialOutsideRefundService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalMaterialOutsideRefundDao approvalMaterialOutsideRefundDao;
	
	@Autowired
	private MaterialOutsideDao materialOutsideDao;
	
	@Autowired
	private MaterialOutsidePaymentDao materialOutsidePaymentDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForMaterialOutsideRefund(ApprovalVO approvalVO, ApprovalMaterialOutsideRefundVO approvalMaterialOutsideRefundVO, String userId) throws FLException {
		
		long moId = approvalMaterialOutsideRefundVO.getMoId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_MATERIAL_OUTSIDE_REFUND_INT, String.valueOf(moId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		MaterialOutsidePO materialOutsidePO = materialOutsideDao.get(approvalMaterialOutsideRefundVO.getMoId());
		
		if(materialOutsidePO == null){
			throw new FLException(180012, "主材场外信息不存在");
		}
		
		if(materialOutsidePO.getStatus() != MaterialOutsidePO.STATUS_COLLECT_INT){
			throw new FLException(180014, "主材场外当前状态不能退款");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MATERIAL_OUTSIDE_REFUND_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(moId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_MATERIAL_OUTSIDE_REFUND_STR, materialOutsidePO.getOrderId(), materialOutsidePO.getOrderAddr(), materialOutsidePO.getCustomerName(), materialOutsidePO.getSales(), materialOutsidePO.getProfit()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		
		approvalDao.save(approvalPO);
		
		ApprovalMaterialOutsideRefundPO approvalMaterialOutsideRefundPO = new ApprovalMaterialOutsideRefundPO();
		approvalMaterialOutsideRefundPO.setAid(approvalPO.getAid());
		approvalMaterialOutsideRefundPO.setMoId(materialOutsidePO.getMoId());
		
		approvalMaterialOutsideRefundDao.save(approvalMaterialOutsideRefundPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForMaterialOutsideRefund(ApprovalPO approvalPO) throws FLException {
		
		ApprovalMaterialOutsideRefundPO approvalMaterialOutsideRefundPO = approvalMaterialOutsideRefundDao.queryApprovalMaterialOutsideRefundByAId(approvalPO.getAid());
		
		if(approvalMaterialOutsideRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		MaterialOutsidePO materialOutsidePO = materialOutsideDao.get(approvalMaterialOutsideRefundPO.getMoId());
		
		if(materialOutsidePO == null){
			throw new FLException(180012, "主材场外信息不存在");
		}
		
		if(materialOutsidePO.getStatus() != MaterialOutsidePO.STATUS_COLLECT_INT){
			throw new FLException(180014, "主材场外当前状态不能退款");
		}
		
		MaterialOutsidePaymentPO materialOutsidePaymentPO = new MaterialOutsidePaymentPO();
		
		materialOutsidePaymentPO.setMoId(materialOutsidePO.getMoId());
		
		materialOutsidePaymentPO.setOrderId(materialOutsidePO.getOrderId());
		materialOutsidePaymentPO.setOrderAddr(materialOutsidePO.getOrderAddr());
		
		materialOutsidePaymentPO.setCustomerName(materialOutsidePO.getCustomerName());
		materialOutsidePaymentPO.setReferMoney(materialOutsidePO.getProfit());
		
		materialOutsidePaymentPO.setPaymentType(MaterialOutsidePaymentPO.PAYMENTTYPE_REFUND_INT);
		materialOutsidePaymentPO.setPaymentStatus(MaterialOutsidePaymentPO.PAYMENTSTATUS_INTI_INT);
		
		materialOutsidePaymentPO.setCreateUserId(approvalPO.getSender().getUserId());
		materialOutsidePaymentPO.setCreateUserName(approvalPO.getSender().getUserName());
		
		materialOutsidePaymentPO.setMaterialTypeName(materialOutsidePO.getMaterialType());
		materialOutsidePaymentPO.setMaterialBrandName(materialOutsidePO.getMaterialBrand());
		
		materialOutsidePaymentDao.save(materialOutsidePaymentPO);
		
		materialOutsidePO.setStatus(MaterialOutsidePO.STATUS_REFUND_INT);
		
		materialOutsideDao.update(materialOutsidePO);
		
		return 0;
	}

}
;