package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalSalesDaymentDao;
import com.fanglin.approval.po.ApprovalSalesDaymentPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalSalesDaymentDao")
public class ApprovalSalesDaymentDaoImpl extends DaoImpl<ApprovalSalesDaymentPO> implements ApprovalSalesDaymentDao {

	public ApprovalSalesDaymentDaoImpl() {
		super(ApprovalSalesDaymentPO.class);
	}

	@Override
	public ApprovalSalesDaymentPO querySalesDaymentByAid(long aid) {
		return (ApprovalSalesDaymentPO) session().createCriteria(ApprovalSalesDaymentPO.class).add(Restrictions.eq("aid", aid)).setMaxResults(1).uniqueResult();
	}

}
