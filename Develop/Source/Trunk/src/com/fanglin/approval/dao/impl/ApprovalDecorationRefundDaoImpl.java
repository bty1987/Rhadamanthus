/**
 * @File Name		: ApprovalDecorationRefundDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationRefundDao;
import com.fanglin.approval.po.ApprovalDecorationRefundPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationRefundDao")
public class ApprovalDecorationRefundDaoImpl extends DaoImpl<ApprovalDecorationRefundPO> implements ApprovalDecorationRefundDao {
	
	public ApprovalDecorationRefundDaoImpl(){
		super(ApprovalDecorationRefundPO.class);
	}
	
	@Override
	public ApprovalDecorationRefundPO queryApprovalDecorationRefundByAId(int aId) {
		return (ApprovalDecorationRefundPO) session().createCriteria(ApprovalDecorationRefundPO.class).add(Restrictions.eq(ApprovalDecorationRefundPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
