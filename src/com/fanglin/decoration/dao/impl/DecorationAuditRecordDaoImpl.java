package com.fanglin.decoration.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationAuditRecordDao;
import com.fanglin.decoration.po.DecorationAuditRecordPO;

@Repository("decorationAuditRecordDao")
public class DecorationAuditRecordDaoImpl extends DaoImpl<DecorationAuditRecordPO> implements DecorationAuditRecordDao {

	public DecorationAuditRecordDaoImpl(){
		super(DecorationAuditRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationAuditRecordPO> queryDecorationAuditRecordByAid(long aid) {
		return session().createCriteria(DecorationAuditRecordPO.class).add(Restrictions.eq(DecorationAuditRecordPO.COLUMN_AID_STR, aid)).list();
	}
	@Override
	public DecorationAuditRecordPO queryDecorationAuditRecordByArid(long arid) {
		return (DecorationAuditRecordPO) session().createCriteria(DecorationAuditRecordPO.class).add(Restrictions.eq(DecorationAuditRecordPO.COLUMN_ARIF_LONG, arid)).uniqueResult();
	}
}
