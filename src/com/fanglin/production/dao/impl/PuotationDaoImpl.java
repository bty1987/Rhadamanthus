package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.PuotationDao;
import com.fanglin.production.po.PuotationPO;

@Repository("puotationDao")
public class PuotationDaoImpl extends DaoImpl<PuotationPO> implements PuotationDao {

	public PuotationDaoImpl() {
		super(PuotationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PuotationPO> queryPuotationByPid(long pid) {
		return session().createCriteria(PuotationPO.class).add(Restrictions.eq(PuotationPO.COLUMN_PID_STR, pid)).list();
	}

	@Override
	public PuotationPO queryPuotationByQid(long qid) {
		return (PuotationPO) createCriteria(PuotationPO.class).add(Restrictions.eq(PuotationPO.COLUMN_QID_STR, qid)).uniqueResult();
	}

}
