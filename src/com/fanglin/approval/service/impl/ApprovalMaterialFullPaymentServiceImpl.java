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

import java.util.Arrays;
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
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.dao.UserDao;
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
	private MaterialDao materialDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForDecorationRefund(ApprovalVO approvalVO, ApprovalMaterialFullPaymentVO approvalMaterialFullPaymentVO, String userId, int company) throws FLException {
		
		long msoId = approvalMaterialFullPaymentVO.getMid();
		
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT, String.valueOf(msoId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		MaterialPO materialPO = materialDao.get(msoId);
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialPO.getFullStatus() != MaterialPO.FINANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180017, "主材订单当前状态不能提交补款");
		}
		
		materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_APPROVAL_INT);
		materialDao.update(materialPO);
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO,Arrays.asList("receiver","sender"));
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(msoId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_MATERIAL_FULL_PAYMENT_STR, materialPO.getOrderId(), materialPO.getNo(), approvalMaterialFullPaymentVO.getReferMoney()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalMaterialFullPaymentPO approvalMaterialFullPaymentPO = new ApprovalMaterialFullPaymentPO();
		approvalMaterialFullPaymentPO.setAid(approvalPO.getAid());
		approvalMaterialFullPaymentPO.setMid(msoId);
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
		
		long msoId = approvalMaterialFullPaymentPO.getMid();
		
		MaterialPO materialPO = materialDao.get(msoId);
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		int fullStatus = materialPO.getFullStatus();
		
		if(fullStatus != MaterialPO.FINANCE_STATUS_TYPE_INIT_INT && fullStatus != MaterialPO.FINANCE_STATUS_TYPE_APPROVAL_INT){
			throw new FLException(180017, "主材订单当前状态不能提交补款");
		}
		
		UserPO sender = approvalPO.getSender();
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMaterial(materialPO);
		materialPaymentPO.setCategory(materialPO.getCategory());
		materialPaymentPO.setBrand(materialPO.getBrand());
		
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT);
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);
		
		materialPaymentPO.setCreater(sender);
		
		materialPaymentPO.setReferMoney(approvalMaterialFullPaymentPO.getReferMoney());
		
		materialPaymentDao.save(materialPaymentPO);
		
		materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT);
		materialPO.setFullPayment(materialPaymentPO.getReferMoney());
		
		materialDao.update(materialPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseForMaterialFullPayment(ApprovalPO approvalPO) throws FLException {
		
		ApprovalMaterialFullPaymentPO approvalMaterialFullPaymentPO = approvalMaterialFullPaymentDao.queryApprovalMaterialFullPaymentByAId(approvalPO.getAid());
		
		if(approvalMaterialFullPaymentPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		long msoId = approvalMaterialFullPaymentPO.getMid();
		
		MaterialPO materialPO = materialDao.get(msoId);
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
		materialDao.update(materialPO);
		
		return 0;
	}

}
