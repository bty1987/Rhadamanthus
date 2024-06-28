package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerSourceDao;
import com.fanglin.approval.po.ApprovalCustomerSourcePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalCustomerSourceDao")
public class ApprovalCustomerSourceDaoImpl extends DaoImpl<ApprovalCustomerSourcePO> implements ApprovalCustomerSourceDao {

	public ApprovalCustomerSourceDaoImpl() {
		super(ApprovalCustomerSourcePO.class);
	}

	@Override
	public ApprovalCustomerSourcePO queryCustomerSourceByAid(long aid) {

		return (ApprovalCustomerSourcePO) session().createCriteria(ApprovalCustomerSourcePO.class).add(Restrictions.eq("aid", aid)).uniqueResult();

	}

}
