package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.AuditRecordPO;

public interface AuditRecordDao extends Dao<AuditRecordPO> {

	public List<AuditRecordPO> queryAuditRecordByAid(long aid);
	
	public AuditRecordPO queryAuditRecordByArid(long arid);
	
}
