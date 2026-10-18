package com.fanglin.data.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.QuotationRtemPO;
import com.fanglin.data.quotation.dao.QuotationRtemDao;

@Repository("quotationRtemDao")
public class QuotationRtemDaoImpl extends DaoImpl<QuotationRtemPO> implements QuotationRtemDao {

	public QuotationRtemDaoImpl() {
		super(QuotationRtemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationRtemPO> queryQuotationRtem(Long sid, Long tid) {
		return session().createCriteria(QuotationRtemPO.class).add(Restrictions.eq("source.qiid", sid)).add(Restrictions.eq("target.qiid", tid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationRtemPO> queryQuotationRtem(Long sid) {
		return session().createCriteria(QuotationRtemPO.class).add(Restrictions.eq("source.qiid", sid)).list();
	}

	@Override
	public int countQuotationRtem(long sqiid) {

		String sql = "select count(*) from quotation.quotationrtem where sqiid = :sqiid";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setLong("sqiid", sqiid).uniqueResult();

		return num.intValue();
	}

	@Override
	public int countQuotationRtem(long sqiid, long tqiid) {

		String sql = "select count(*) from quotation.quotationrtem where sqiid = :sqiid and tqiid = :tqiid";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setLong("sqiid", sqiid).setLong("tqiid", tqiid).uniqueResult();

		return num.intValue();
	}

}
