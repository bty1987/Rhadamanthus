package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationBelongDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationBelongPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalCustomerOriginTDecorationBelongDao")
public class ApprovalCustomerOriginTDecorationBelongDaoImpl extends DaoImpl<ApprovalCustomerOriginTDecorationBelongPO> implements ApprovalCustomerOriginTDecorationBelongDao {

	public ApprovalCustomerOriginTDecorationBelongDaoImpl() {
		super(ApprovalCustomerOriginTDecorationBelongPO.class);
	}

	@Override
	public ApprovalCustomerOriginTDecorationBelongPO queryApprovalCustomerOriginTDecorationBelongByAid(long aid) {
		return (ApprovalCustomerOriginTDecorationBelongPO) session().createCriteria(ApprovalCustomerOriginTDecorationBelongPO.class).add(Restrictions.eq("aid", aid)).uniqueResult();
	}

}
