package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDecorationHolonomyDao;
import com.fanglin.approval.po.ApprovalDecorationHolonomyPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationHolonomyDao")
public class ApprovalDecorationHolonomyDaoImpl extends DaoImpl<ApprovalDecorationHolonomyPO> implements ApprovalDecorationHolonomyDao {

	public ApprovalDecorationHolonomyDaoImpl() {
		super(ApprovalDecorationHolonomyPO.class);
	}

	@Override
	public ApprovalDecorationHolonomyPO queryApprovalDecorationHolonomyByAId(long aId) {
		return (ApprovalDecorationHolonomyPO) session().createCriteria(ApprovalDecorationHolonomyPO.class).add(Restrictions.eq("aid", aId)).uniqueResult();
	}
	
}
