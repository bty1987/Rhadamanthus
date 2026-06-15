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
		return createCriteria(NormriceItemPO.class).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("status", NormriceItemPO.STATUS_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormriceItemPO> queryNormriceItemByType(long qid, short type) {
		return createCriteria(NormriceItemPO.class).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("type", type)).add(Restrictions.in("status", new Short[]{NormriceItemPO.STATUS_INIT_INT, NormriceItemPO.STATUS_CONFIRMED_INT})).list();
	}

	@Override
	public NormriceItemPO queryNormriceItem(long sid, long quoteId, long npid, short type) {
		return (NormriceItemPO) session().createCriteria(NormriceItemPO.class).add(Restrictions.eq("sid", sid)).add(Restrictions.eq("quoteld", quoteId)).add(Restrictions.eq("npid", npid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int amountNormriceItem(long qid, long cnid) {

		String sql = "select sum(if(atttype = 0, salary, -salary)*if(trannum = 0, 1, num/1000*trannum/1000)) from quotation.normriceitem where qid =:qid and cnid = :cnid and status = :status";
		BigDecimal count = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("status", NormriceItemPO.STATUS_INIT_INT).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int disabledNormriceItem(long qid) {

		String sql = "update quotation.normriceitem set status = :status where qid = :qid and type != :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("status", NormriceItemPO.STATUS_DISABLED_INT).setShort("type", NormriceItemPO.TYPE_QUOTA_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormriceItem(long qid, short type) {

		String sql = "update quotation.normriceitem set status = :status where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", NormriceItemPO.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormriceItem(long qid, long sid, short type) {

		String sql = "update quotation.normriceitem set status = :status where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).setLong("sid", sid).setShort("status", NormriceItemPO.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormriceItem(long qid, long sid, long quoteId, short type) {

		String sql = "update quotation.normriceitem set status = :status where qid = :qid and type = :type and sid = :sid and quoteId = :quoteId";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).setLong("quoteId", quoteId).setShort("status", NormriceItemPO.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(long qid, short type) {

		String sql = "delete from quotation.normriceitem where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(long qid, short type, short status) {

		String sql = "delete from quotation.normriceitem where qid = :qid and type = :type and status = :status";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", status).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(long qid, long sid, short type) {

		String sql = "delete from quotation.normriceitem where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int confirmNormriceItem(long npiid) {

		String sql = "update quotation.normriceitem set status = :status where npiid = :npiid";
		session().createSQLQuery(sql).setLong("npiid", npiid).setShort("status", NormriceItemPO.STATUS_CONFIRMED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int rejectNormriceItem(long npiid) {

		String sql = "update quotation.normriceitem set status = :status where npiid = :npiid";
		session().createSQLQuery(sql).setLong("npiid", npiid).setShort("status", NormriceItemPO.STATUS_REJECTED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int amountNormriceItemForSalary(long qid, long cnid) {

		String sql = "select sum(if(atttype = 0, salary, -salary)*if(trannum = 0, 1, num/1000*trannum/1000)) from quotation.normriceitem where qid = :qid and cnid = :cnid and ((status = :statusInit and type != :typeQuota) or (status = :statusConfirmed and type = :typeQuota))";
		Number count = (Number) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("statusInit", NormriceItemPO.STATUS_INIT_INT).setShort("statusConfirmed", NormriceItemPO.STATUS_CONFIRMED_INT).setShort("typeQuota", NormriceItemPO.TYPE_QUOTA_INT).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countInitNormriceItem(long qid, long cnid) {

		String sql = "select count(*) from quotation.normriceitem where qid = :qid and cnid = :cnid and status = :status";
		Number count = (Number) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("status", NormriceItemPO.STATUS_INIT_INT).uniqueResult();

		return count == null ? 0 : count.intValue();
	}
}
