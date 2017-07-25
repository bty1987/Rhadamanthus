package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.AuditScaleDao;
import com.fanglin.decoration.po.AuditScalePO;

@Repository("AuditScaleDao")
public class AuditScaleDaoImpl extends DaoImpl<AuditScalePO> implements AuditScaleDao {
	
	public AuditScaleDaoImpl(){
		super(AuditScalePO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AuditScalePO> queryAudtiScaleByArid(Long arid) {
		return session().createCriteria(AuditScalePO.class).add(Restrictions.eq(AuditScalePO.COLUMN_ARID_STR, arid)).list();
	}

}
