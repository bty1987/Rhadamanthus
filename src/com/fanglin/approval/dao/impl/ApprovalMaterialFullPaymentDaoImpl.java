/**
 * @File Name		: ApprovalMaterialFullPaymentDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalMaterialFullPaymentDao;
import com.fanglin.approval.po.ApprovalMaterialFullPaymentPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalMaterialFullPaymentDao")
public class ApprovalMaterialFullPaymentDaoImpl extends DaoImpl<ApprovalMaterialFullPaymentPO> implements ApprovalMaterialFullPaymentDao {
	
	public ApprovalMaterialFullPaymentDaoImpl(){
		super(ApprovalMaterialFullPaymentPO.class);
	}

	@Override
	public ApprovalMaterialFullPaymentPO queryApprovalMaterialFullPaymentByAId(long aId) {
		return (ApprovalMaterialFullPaymentPO) session().createCriteria(ApprovalMaterialFullPaymentPO.class).add(Restrictions.eq(ApprovalMaterialFullPaymentPO.COLUMN_AID_STR, aId)).setMaxResults(1).uniqueResult();
	}

}
