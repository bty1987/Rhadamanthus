package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalPaymentWithdrawDao;
import com.fanglin.approval.po.ApprovalPaymentWithdrawPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalPaymentWithdrawDao")
public class ApprovalPaymentWithdrawDaoImpl extends DaoImpl<ApprovalPaymentWithdrawPO> implements ApprovalPaymentWithdrawDao {

	public ApprovalPaymentWithdrawDaoImpl() {
		super(ApprovalPaymentWithdrawPO.class);
	}

	@Override
	public ApprovalPaymentWithdrawPO queryApprovalPaymentWithdrawByAId(long aId) {
		return (ApprovalPaymentWithdrawPO) session().createCriteria(ApprovalPaymentWithdrawPO.class).add(Restrictions.eq(ApprovalPaymentWithdrawPO.COLUMN_AID_STR, aId)).setMaxResults(1).uniqueResult();
	}

}
