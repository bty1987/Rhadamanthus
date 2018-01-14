package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalManifestDBItemDao;
import com.fanglin.approval.po.ApprovalManifestDBItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalManifestDBItemDao")
public class ApprovalManifestDBItemDaoImpl extends DaoImpl<ApprovalManifestDBItemPO> implements ApprovalManifestDBItemDao {
	
	public ApprovalManifestDBItemDaoImpl() {
		super(ApprovalManifestDBItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalManifestDBItemPO> queryApprovalManifestDBItemByAmdbid(long amdbid) {
	
		return session().createCriteria(ApprovalManifestDBItemPO.class).add(Restrictions.eq(ApprovalManifestDBItemPO.COLUMN_AMDBID_STR, amdbid)).list();
	}

}
