/**
 * @File Name		: ApprovalCustomerOriginDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-10-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerOriginDao;
import com.fanglin.approval.po.ApprovalCustomerOriginPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalCustomerOriginDao")
public class ApprovalCustomerOriginDaoImpl extends DaoImpl<ApprovalCustomerOriginPO> implements ApprovalCustomerOriginDao {

	public ApprovalCustomerOriginDaoImpl() {
		super(ApprovalCustomerOriginPO.class);
	}

	@Override
	public ApprovalCustomerOriginPO queryCustomerOriginByAid(long aid) {
		return (ApprovalCustomerOriginPO) session().createCriteria(ApprovalCustomerOriginPO.class).add(Restrictions.eq("aid", aid)).uniqueResult();
	}

}
