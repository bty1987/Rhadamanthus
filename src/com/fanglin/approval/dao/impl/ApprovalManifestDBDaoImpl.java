package com.fanglin.approval.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalManifestDBDao;
import com.fanglin.approval.po.ApprovalManifestDBPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalManifestDBDao")
public class ApprovalManifestDBDaoImpl extends DaoImpl<ApprovalManifestDBPO>implements ApprovalManifestDBDao{
	
	public ApprovalManifestDBDaoImpl() {
		super(ApprovalManifestDBPO.class);
	}
	@Override
	public ApprovalManifestDBPO queryApprovalManifestDBByAId(long aid) {
		return (ApprovalManifestDBPO) session().createCriteria(ApprovalManifestDBPO.class).add(Restrictions.eq(ApprovalManifestDBPO.COLUMN_AID_STR, aid)).uniqueResult();
	}

}
