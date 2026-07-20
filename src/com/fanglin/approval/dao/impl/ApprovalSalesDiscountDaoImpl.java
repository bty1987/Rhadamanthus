package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalSalesDiscountDao;
import com.fanglin.approval.po.ApprovalSalesDiscountPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalSalesDiscountDao")
public class ApprovalSalesDiscountDaoImpl extends DaoImpl<ApprovalSalesDiscountPO>implements ApprovalSalesDiscountDao{
	
	public ApprovalSalesDiscountDaoImpl() {
		super(ApprovalSalesDiscountPO.class);
	}
	@Override
	public ApprovalSalesDiscountPO queryApprovalSalesDiscountByAId(long aid) {
		return (ApprovalSalesDiscountPO) session().createCriteria(ApprovalSalesDiscountPO.class).add(Restrictions.eq(ApprovalSalesDiscountPO.COLUMN_AID_STR, aid)).setMaxResults(1).uniqueResult();
	}

}
