package com.fanglin.quotation.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.po.NormriceItemPO;

@Repository("quotationNormriceItemDao")
public class NormriceItemDaoImpl extends DaoImpl<NormriceItemPO> implements NormriceItemDao {

	public NormriceItemDaoImpl() {
		super(NormriceItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormriceItemPO> queryNormriceItem(long qid) {
		return createCriteria(NormriceItemPO.class).add(Restrictions.eq("qid", qid)).list();
	}

	@Override
	public int amountNormriceItem(long qid, long cnid) {

		String sql = "select sum(if(atttype = 0, salary, -salary)*num/1000) from quotation.normriceitem where qid =:qid and cnid = :cnid";
		BigDecimal count = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int deleteNormriceItem(long qid, short type) {

		String sql = "delete from quotation.normriceitem where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(long qid, long sid, short type) {

		String sql = "delete from quotation.normriceitem where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setShort("type", type).executeUpdate();

		return 0;
	}
}
