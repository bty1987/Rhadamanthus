/**
 * @File Name		: ApprovalDecorationCustomerDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalDecorationCustomerDao;
import com.fanglin.approval.po.ApprovalDecorationCustomerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalDecorationCustomerDao")
public class ApprovalDecorationCustomerDaoImpl extends DaoImpl<ApprovalDecorationCustomerPO> implements ApprovalDecorationCustomerDao {
	
	public ApprovalDecorationCustomerDaoImpl(){
		super(ApprovalDecorationCustomerPO.class);
	}

	@Override
	public ApprovalDecorationCustomerPO queryApprovalDecorationCustomerByAId(long aId) {
		return (ApprovalDecorationCustomerPO) session().createCriteria(ApprovalDecorationCustomerPO.class).add(Restrictions.eq(ApprovalDecorationCustomerPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
