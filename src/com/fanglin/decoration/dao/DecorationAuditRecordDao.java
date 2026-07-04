package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationAuditRecordPO;

public interface DecorationAuditRecordDao extends Dao<DecorationAuditRecordPO> {

	public List<DecorationAuditRecordPO> queryDecorationAuditRecordByAid(long aid);

	public DecorationAuditRecordPO queryDecorationAuditRecordByArid(long arid);

}
