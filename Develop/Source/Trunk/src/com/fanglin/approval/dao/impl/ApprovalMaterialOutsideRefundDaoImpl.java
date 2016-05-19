/**
 * @File Name		: ApprovalMaterialOutsideRefundDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalMaterialOutsideRefundDao;
import com.fanglin.approval.po.ApprovalMaterialOutsideRefundPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalMaterialOutsideRefundDao")
public class ApprovalMaterialOutsideRefundDaoImpl extends DaoImpl<ApprovalMaterialOutsideRefundPO> implements ApprovalMaterialOutsideRefundDao {
	
	public ApprovalMaterialOutsideRefundDaoImpl(){
		super(ApprovalMaterialOutsideRefundPO.class);
	}
	
	@Override
	public ApprovalMaterialOutsideRefundPO queryApprovalMaterialOutsideRefundByAId(int aId) {
		return (ApprovalMaterialOutsideRefundPO) session().createCriteria(ApprovalMaterialOutsideRefundPO.class).add(Restrictions.eq(ApprovalMaterialOutsideRefundPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
