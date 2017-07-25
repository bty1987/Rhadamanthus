package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.AuditRecordPO;

public interface AuditRecordDao extends Dao<AuditRecordPO> {

	public List<AuditRecordPO> queryAuditRecordByOrderId(String orderId);
	
	public AuditRecordPO queryAuditRecordByArid(long arid);
	
}
