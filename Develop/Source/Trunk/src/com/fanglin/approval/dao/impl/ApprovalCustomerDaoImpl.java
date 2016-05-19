/**
 * @File Name		: ApprovalCustomerDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalCustomerDao;
import com.fanglin.approval.po.ApprovalCustomerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalCustomerDao")
public class ApprovalCustomerDaoImpl extends DaoImpl<ApprovalCustomerPO> implements ApprovalCustomerDao {
	
	public ApprovalCustomerDaoImpl(){
		super(ApprovalCustomerPO.class);
	}

	@Override
	public ApprovalCustomerPO queryApprovalCustomerByAId(int aId) {
		return (ApprovalCustomerPO) session().createCriteria(ApprovalCustomerPO.class).add(Restrictions.eq(ApprovalCustomerPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
