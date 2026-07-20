package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.PuotationItemDao;
import com.fanglin.production.po.PuotationItemPO;

@Repository("puotationItemDao")
public class PuotationItemDaoImpl extends DaoImpl<PuotationItemPO> implements PuotationItemDao {

	@Override
	@SuppressWarnings("unchecked")
	public List<PuotationItemPO> queryPuotationItemByQid(long qid) {
		return session().createCriteria(PuotationItemPO.class).add(Restrictions.eq(PuotationItemPO.COLUMN_QID_STR, qid)).list();

	}

	@Override
	public PuotationItemPO queryPuotationItemByQiid(long qiid) {
		return (PuotationItemPO) createCriteria(PuotationItemPO.class).add(Restrictions.eq(PuotationItemPO.COLUMN_QIID_STR, qiid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deletePuotationItemByQId(long qid) {
		
		String sql = "delete from production.quotationItem where qid = :qid";
		session().createSQLQuery(sql).setLong("qid", qid).executeUpdate();
		
		return 0;
	}

}
