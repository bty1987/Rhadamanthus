package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalQuotationPreferDao;
import com.fanglin.approval.po.ApprovalQuotationPreferPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalQuotationPreferDao")
public class ApprovalQuotationPreferDaoImpl extends DaoImpl<ApprovalQuotationPreferPO> implements ApprovalQuotationPreferDao {

	@Override
	public ApprovalQuotationPreferPO queryApprovalQuotationPreferByAid(long aId) {
		return (ApprovalQuotationPreferPO) session().createCriteria(ApprovalQuotationPreferPO.class).add(Restrictions.eq(ApprovalQuotationPreferPO.COLUMN_AID_STR, aId)).uniqueResult();
	}

}
