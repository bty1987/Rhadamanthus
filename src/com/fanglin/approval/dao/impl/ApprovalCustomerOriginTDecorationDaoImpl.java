package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalCustomerOriginTDecorationDao")
public class ApprovalCustomerOriginTDecorationDaoImpl extends DaoImpl<ApprovalCustomerOriginTDecorationPO> implements ApprovalCustomerOriginTDecorationDao {

	public ApprovalCustomerOriginTDecorationDaoImpl(){
		super(ApprovalCustomerOriginTDecorationPO.class);
	}
	
	@Override
	public ApprovalCustomerOriginTDecorationPO queryCustomerOriginTDecorationByAid(long aid) {
		
		return (ApprovalCustomerOriginTDecorationPO) session().createCriteria(ApprovalCustomerOriginTDecorationPO.class).add(Restrictions.eq("aid", aid)).uniqueResult();
	
	}

}
