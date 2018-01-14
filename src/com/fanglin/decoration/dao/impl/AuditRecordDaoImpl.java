package com.fanglin.decoration.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.AuditRecordDao;
import com.fanglin.decoration.po.AuditRecordPO;

@Repository("auditRecordDao")
public class AuditRecordDaoImpl extends DaoImpl<AuditRecordPO> implements AuditRecordDao {

	public AuditRecordDaoImpl(){
		super(AuditRecordPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AuditRecordPO> queryAuditRecordByAid(long aid) {
		return session().createCriteria(AuditRecordPO.class).add(Restrictions.eq(AuditRecordPO.COLUMN_AID_STR, aid)).list();
	}
	@Override
	public AuditRecordPO queryAuditRecordByArid(long arid) {
		return (AuditRecordPO) session().createCriteria(AuditRecordPO.class).add(Restrictions.eq(AuditRecordPO.COLUMN_ARIF_LONG, arid)).uniqueResult();
	}
}