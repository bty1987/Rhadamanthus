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
	public List<AuditRecordPO> queryAuditRecordByOrderId(String orderId) {
		return session().createCriteria(AuditRecordPO.class).createAlias("audit", "audit").createAlias("audit.decorationOrder", "decorationOrder").add(Restrictions.eq(AuditRecordPO.COLUMN_ORDERID_STR, orderId)).list();
	}
	@Override
	public AuditRecordPO queryAuditRecordByArid(long arid) {
		return (AuditRecordPO) session().createCriteria(AuditRecordPO.class).add(Restrictions.eq(AuditRecordPO.COLUMN_ARIF_LONG, arid)).uniqueResult();
	}
}