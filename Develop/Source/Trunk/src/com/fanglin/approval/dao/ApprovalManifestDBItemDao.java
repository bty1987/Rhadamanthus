package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalManifestDBItemPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalManifestDBItemDao extends Dao<ApprovalManifestDBItemPO>{
	
	public List<ApprovalManifestDBItemPO> queryApprovalManifestDBItemByAmdbid(long amdbid);
	
}
