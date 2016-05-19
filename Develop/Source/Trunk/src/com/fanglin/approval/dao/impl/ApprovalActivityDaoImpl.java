/**
 * @File Name		: ApprovalActivityDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalActivityDao;
import com.fanglin.approval.po.ApprovalActivityPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalActivityDao")
public class ApprovalActivityDaoImpl extends DaoImpl<ApprovalActivityPO> implements ApprovalActivityDao {
	
	public ApprovalActivityDaoImpl(){
		super(ApprovalActivityPO.class);
	}
	
	@Override
	public ApprovalActivityPO queryApprovalActivityByAId(int aId) {
		return (ApprovalActivityPO) session().createCriteria(ApprovalActivityPO.class).add(Restrictions.eq(ApprovalActivityPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
