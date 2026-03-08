package com.fanglin.quotation.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormtimeItemDao;
import com.fanglin.quotation.po.NormtimeItemPO;

@Repository("quotationNormtimeItemDao")
public class NormtimeItemDaoImpl extends DaoImpl<NormtimeItemPO> implements NormtimeItemDao {

	public NormtimeItemDaoImpl() {
		super(NormtimeItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormtimeItemPO> queryNormtimeItem(long qid) {
		return createCriteria(NormtimeItemPO.class).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("status", NormtimeItemPO.STATUS_INIT_INT)).list();
	}

	@Override
	public NormtimeItemPO queryNormtimeItem(long sid, long quoteId, long ntid, short type) {
		return (NormtimeItemPO) session().createCriteria(NormtimeItemPO.class).add(Restrictions.eq("sid", sid)).add(Restrictions.eq("quoteld", quoteId)).add(Restrictions.eq("ntid", ntid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int amountNormtimeItem(long qid, long cnid) {

		String sql = "select sum(if(atttype = 0, workdays, -workdays)*if(trannum = 0, 1, num/1000*trannum/1000)) from quotation.normtimeitem where qid =:qid and cnid = :cnid and status = :status";
		BigDecimal count = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("status", NormtimeItemPO.STATUS_INIT_INT).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int disabledNormtimeItem(long qid) {

		String sql = "update quotation.normtimeitem set status = :status where qid = :qid and type != :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("status", NormtimeItemPO.STATUS_DISABLED_INT).setShort("type", NormtimeItemPO.TYPE_QUOTA_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormtimeItem(long qid, short type) {

		String sql = "update quotation.normtimeitem set status = :status where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", NormtimeItemPO.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormtimeItem(long qid, long sid, short type) {

		String sql = "update quotation.normtimeitem set status = :status where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).setLong("sid", sid).setShort("status", NormtimeItemPO.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormtimeItem(long qid, long sid, long quoteId, short type) {

		String sql = "update quotation.normtimeitem set status = :status where qid = :qid and type = :type and sid = :sid and quoteId = :quoteId";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).setLong("quoteId", quoteId).setShort("status", NormtimeItemPO.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormtimeItem(long qid, short type) {

		String sql = "delete from quotation.normtimeitem where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormtimeItem(long qid, short type, short status) {

		String sql = "delete from quotation.normtimeitem where qid = :qid and type = :type and status = :status";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", status).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormtimeItem(long qid, long sid, short type) {

		String sql = "delete from quotation.normtimeitem where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setShort("type", type).executeUpdate();

		return 0;
	}
}
