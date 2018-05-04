package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalSalesRefundDao;
import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.core.dao.impl.DaoImpl;


@Repository("approvalSalesRefundDao")
public class ApprovalSalesRefundDaoImpl extends DaoImpl<ApprovalSalesRefundPO>implements ApprovalSalesRefundDao {

	public ApprovalSalesRefundDaoImpl() {
		super(ApprovalSalesRefundPO.class);
	}

	@Override
	public ApprovalSalesRefundPO queryApprovalSalesRefundByAId(long aId) {
		return (ApprovalSalesRefundPO) session().createCriteria(ApprovalSalesRefundPO.class).add(Restrictions.eq(ApprovalSalesRefundPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
