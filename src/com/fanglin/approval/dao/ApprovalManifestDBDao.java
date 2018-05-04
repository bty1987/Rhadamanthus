package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalManifestDBPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalManifestDBDao extends Dao<ApprovalManifestDBPO>{
	
	public ApprovalManifestDBPO queryApprovalManifestDBByAId(long aId);
	
}
