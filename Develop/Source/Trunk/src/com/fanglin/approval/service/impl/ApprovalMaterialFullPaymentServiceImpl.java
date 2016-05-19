/**
 * @File Name		: ApprovalMaterialFullPaymentServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-16
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
import com.fanglin.approval.dao.ApprovalMaterialFullPaymentDao;
import com.fanglin.approval.po.ApprovalMaterialFullPaymentPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalMaterialFullPaymentService;
import com.fanglin.approval.vo.ApprovalMaterialFullPaymentVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalMaterialFullPaymentService")
@Transactional(readOnly=true)
public class ApprovalMaterialFullPaymentServiceImpl implements ApprovalMaterialFullPaymentService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalMaterialFullPaymentDao approvalMaterialFullPaymentDao;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForDecorationRefund(ApprovalVO approvalVO, ApprovalMaterialFullPaymentVO approvalMaterialFullPaymentVO, String userId) throws FLException {
		
		long msoId = approvalMaterialFullPaymentVO.getMsoId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT, String.valueOf(msoId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialSubOrderPO.getFullStatus() != MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180017, "主材订单当前状态不能提交补款");
		}
		
		materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_APPROVAL_INT);
		materialSubOrderDao.update(materialSubOrderPO);
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(msoId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_MATERIAL_FULL_PAYMENT_STR, materialSubOrderPO.getOrderId(), materialSubOrderPO.getMsoNo(), approvalMaterialFullPaymentVO.getReferMoney()));
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		approvalPO.setSender(new UserPO(userId));
		
		approvalDao.save(approvalPO);
		
		ApprovalMaterialFullPaymentPO approvalMaterialFullPaymentPO = new ApprovalMaterialFullPaymentPO();
		approvalMaterialFullPaymentPO.setAid(approvalPO.getAid());
		approvalMaterialFullPaymentPO.setMsoId(msoId);
		approvalMaterialFullPaymentPO.setReferMoney(approvalMaterialFullPaymentVO.getReferMoney());
		
		approvalMaterialFullPaymentDao.save(approvalMaterialFullPaymentPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForMaterialFullPayment(ApprovalPO approvalPO) throws FLException {
		
		ApprovalMaterialFullPaymentPO approvalMaterialFullPaymentPO = approvalMaterialFullPaymentDao.queryApprovalMaterialFullPaymentByAId(approvalPO.getAid());
		
		if(approvalMaterialFullPaymentPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		long msoId = approvalMaterialFullPaymentPO.getMsoId();
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		int fullStatus = materialSubOrderPO.getFullStatus();
		
		if(fullStatus != MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT && fullStatus != MaterialSubOrderPO.FINANCE_STATUS_TYPE_APPROVAL_INT){
			throw new FLException(180017, "主材订单当前状态不能提交补款");
		}
		
		UserPO sender = approvalPO.getSender();
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMsoId(msoId);
		materialPaymentPO.setMsoNo(materialSubOrderPO.getMsoNo());
		materialPaymentPO.setMaterialType(materialSubOrderPO.getMaterialType());
		materialPaymentPO.setMaterialBrand(materialSubOrderPO.getMaterialBrand());
		
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT);
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);
		
		materialPaymentPO.setCustomerId(materialSubOrderPO.getCustomerId());
		materialPaymentPO.setCustomerName(materialSubOrderPO.getCustomerName());
		
		materialPaymentPO.setCreateUserId(sender.getUserId());
		materialPaymentPO.setCreateUserName(sender.getUserName());
		
		materialPaymentPO.setReferMoney(approvalMaterialFullPaymentPO.getReferMoney());
		
		materialPaymentDao.save(materialPaymentPO);
		
		materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COMMIT_INT);
		materialSubOrderPO.setFullPayment(materialPaymentPO.getReferMoney());
		
		materialSubOrderDao.update(materialSubOrderPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseForMaterialFullPayment(ApprovalPO approvalPO) throws FLException {
		
		ApprovalMaterialFullPaymentPO approvalMaterialFullPaymentPO = approvalMaterialFullPaymentDao.queryApprovalMaterialFullPaymentByAId(approvalPO.getAid());
		
		if(approvalMaterialFullPaymentPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		long msoId = approvalMaterialFullPaymentPO.getMsoId();
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT);
		materialSubOrderDao.update(materialSubOrderPO);
		
		return 0;
	}

}
