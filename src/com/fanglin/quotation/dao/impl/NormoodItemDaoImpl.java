package com.fanglin.quotation.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.po.NormoodItemPO;

@Repository("quotationNormoodItemDao")
public class NormoodItemDaoImpl extends DaoImpl<NormoodItemPO> implements NormoodItemDao {

	public NormoodItemDaoImpl() {
		super(NormoodItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormoodItemPO> queryNormoodItem(long qid) {
		return createCriteria(NormoodItemPO.class).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("status", NormoodItemPO.STATUS_INIT_INT)).list();
	}

	@Override
	public NormoodItemPO queryNormoodItem(long sid, long quoteId, long ngid, short type) {
		return (NormoodItemPO) session().createCriteria(NormoodItemPO.class).add(Restrictions.eq("sid", sid)).add(Restrictions.eq("quoteld", quoteId)).add(Restrictions.eq("ngid", ngid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int amountNormoodItem(long qid, long nid) {

		String sql = "select sum(if(atttype = 0, storenum, -storenum)) from quotation.normooditem where qid =:qid and nid = :nid and status = :status";
		BigDecimal count = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("nid", nid).setShort("status", NormoodItemPO.STATUS_INIT_INT).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countNormoodItem(long sid, short type) {

		String sql = "select count(*) from quotation.normooditem where qid =:qid and sid = :sid and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("sid", sid).setShort("type", type).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countNormoodItem(long sid, long quoteld, short type) {

		String sql = "select count(*) from quotation.normooditem where qid =:qid and sid = :sid and quoteld = :quoteId and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("sid", sid).setLong("quoteId", quoteld).setShort("type", type).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int disableNormoodItem(long qid) {

		String sql = "update quotation.normooditem set status = :status where qid = :qid and type != :type";
		session().createSQLQuery(sql).setShort("status", NormoodItemPO.STATUS_DISABLED_INT).setLong("qid", qid).setShort("type", NormoodItemPO.TYPE_QUOTA_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disableNormoodItem(long qid, short type) {

		String sql = "update quotation.normooditem set status = :status where qid = :qid and type = :type";
		session().createSQLQuery(sql).setShort("status", NormoodItemPO.STATUS_DISABLED_INT).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int disableNormoodItem(long qid, long sid, short type) {

		String sql = "update quotation.normooditem set status = :status where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setShort("status", NormoodItemPO.STATUS_DISABLED_INT).setLong("sid", sid).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int disableNormoodItem(long qid, long sid, long quoteId, short type) {

		String sql = "update quotation.normooditem set status = :status where qid = :qid and type = :type and sid = :sid and quoteld = :quoteId";
		session().createSQLQuery(sql).setShort("status", NormoodItemPO.STATUS_DISABLED_INT).setLong("qid", qid).setLong("sid", sid).setLong("quoteId", quoteId).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(long qid, short type) {

		String sql = "delete from quotation.normooditem where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(long qid, short type, short status) {

		String sql = "delete from quotation.normooditem where qid = :qid and type = :type and status = :status";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", status).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(long qid, long sid, short type) {

		String sql = "delete from quotation.normooditem where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(long qid, long sid, long quoteId, short type) {

		String sql = "delete from quotation.normooditem where qid = :qid and sid = :sid and quoteld = :quoteId and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setLong("quoteId", quoteId).setShort("type", type).executeUpdate();

		return 0;
	}

}
