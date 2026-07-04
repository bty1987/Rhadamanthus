package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationAuditScaleDao;
import com.fanglin.decoration.po.DecorationAuditScalePO;

@Repository("decorationAuditScaleDao")
public class DecorationAuditScaleDaoImpl extends DaoImpl<DecorationAuditScalePO> implements DecorationAuditScaleDao {

	public DecorationAuditScaleDaoImpl(){
		super(DecorationAuditScalePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DecorationAuditScalePO> queryDecorationAuditScaleByArid(Long arid) {
		return session().createCriteria(DecorationAuditScalePO.class).add(Restrictions.eq(DecorationAuditScalePO.COLUMN_ARID_STR, arid)).list();
	}

}
