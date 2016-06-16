/**
 * @File Name		: ApprovalQuotationDiscountDaoImpl.java
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

import com.fanglin.approval.dao.ApprovalQuotationDiscountDao;
import com.fanglin.approval.po.ApprovalQuotationDiscountPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalQuotationDiscountDao")
public class ApprovalQuotationDiscountDaoImpl extends DaoImpl<ApprovalQuotationDiscountPO> implements ApprovalQuotationDiscountDao {
	
	public ApprovalQuotationDiscountDaoImpl(){
		super(ApprovalQuotationDiscountPO.class);
	}

	@Override
	public ApprovalQuotationDiscountPO queryApprovalQuotationDiscountByAId(int aId) {
		return (ApprovalQuotationDiscountPO) session().createCriteria(ApprovalQuotationDiscountPO.class).add(Restrictions.eq(ApprovalQuotationDiscountPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
