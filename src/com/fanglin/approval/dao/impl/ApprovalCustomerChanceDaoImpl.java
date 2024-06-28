package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerChanceDao;
import com.fanglin.approval.po.ApprovalCustomerChancePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalCustomerChanceDao")
public class ApprovalCustomerChanceDaoImpl extends DaoImpl<ApprovalCustomerChancePO> implements ApprovalCustomerChanceDao {

	public ApprovalCustomerChanceDaoImpl() {
		super(ApprovalCustomerChancePO.class);
	}

	@Override
	public ApprovalCustomerChancePO queryCustomerChanceByAid(long aid) {
		return (ApprovalCustomerChancePO) session().createCriteria(ApprovalCustomerChancePO.class).add(Restrictions.eq("aid", aid)).uniqueResult();
	}

}
