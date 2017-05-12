package com.fanglin.inventory.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.ApprovalSalesRefundDao;
import com.fanglin.inventory.po.ApprovalSalesRefundPO;

@Repository("approvalSalesRefundDao")
public class ApprovalSalesRefundDaoImpl extends DaoImpl<ApprovalSalesRefundPO>implements ApprovalSalesRefundDao {

	public ApprovalSalesRefundDaoImpl() {
		super(ApprovalSalesRefundPO.class);
	}

	@Override
	public ApprovalSalesRefundPO queryApprovalSalesRefundByAId(int aId) {
		return (ApprovalSalesRefundPO) session().createCriteria(ApprovalSalesRefundPO.class).add(Restrictions.eq(ApprovalSalesRefundPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
