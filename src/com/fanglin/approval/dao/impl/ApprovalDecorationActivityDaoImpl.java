/**
 * @File Name		: ApprovalDecorationActivityDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationActivityDao;
import com.fanglin.approval.po.ApprovalDecorationActivityPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationActivityDao")
public class ApprovalDecorationActivityDaoImpl extends DaoImpl<ApprovalDecorationActivityPO> implements ApprovalDecorationActivityDao {
	
	public ApprovalDecorationActivityDaoImpl(){
		super(ApprovalDecorationActivityPO.class);
	}
	
	@Override
	public ApprovalDecorationActivityPO queryApprovalDecorationActivityByAId(long aId) {
		return (ApprovalDecorationActivityPO) session().createCriteria(ApprovalDecorationActivityPO.class).add(Restrictions.eq(ApprovalDecorationActivityPO.COLUMN_AID_STR, aId)).setMaxResults(1).uniqueResult();
	}

}
