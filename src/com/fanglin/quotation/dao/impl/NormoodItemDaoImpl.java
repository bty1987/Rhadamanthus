package com.fanglin.quotation.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.NormoodItemBase;

@Repository("quotationNormoodItemDao")
public class NormoodItemDaoImpl extends DaoImpl<NormoodItemBase> implements NormoodItemDao {

	public NormoodItemDaoImpl() {
		super(NormoodItemBase.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormoodItemBase> queryNormoodItem(int index, long qid) {
		return session().createCriteria(NormoodItemPO.factoryToClazz(index)).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("status", NormoodItemBase.STATUS_INIT_INT)).list();
	}

	@Override
	public NormoodItemBase queryNormoodItem(int index, long sid, long quoteId, long ngid, short type) {
		return (NormoodItemBase) session().createCriteria(NormoodItemPO.factoryToClazz(index)).add(Restrictions.eq("sid", sid)).add(Restrictions.eq("quoteld", quoteId)).add(Restrictions.eq("ngid", ngid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public NormoodItemBase getNormoodItem(int index, long ngiid) {
		return (NormoodItemBase) session().createCriteria(NormoodItemPO.factoryToClazz(index)).add(Restrictions.eq("ngiid", ngiid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public long amountNormoodItem(int index, long qid, long nid) {

		// 同族归一:铺法(normood)全局共享,明细可能挂其他公司同族实例,按pnid族合并统计;pnid=0自建行仅统计自身
		String sql = "select sum(if(ni.atttype = 0, ni.storenum, -ni.storenum)) from quotation.%s ni where ni.qid = :qid and ni.status = :status and (ni.nid = :nid or ni.nid in (select x.nid from data.noods x where x.pnid != 0 and x.pnid = (select t.pnid from data.noods t where t.nid = :nid)))";
		sql = String.format(sql, NormoodItemPO.tableName(index));
		BigDecimal count = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("nid", nid).setShort("status", NormoodItemBase.STATUS_INIT_INT).uniqueResult();

		return count == null ? 0 : count.longValue();
	}

	@Override
	public int countNormoodItem(int index, long qid, long sid, short type) {

		String sql = "select count(*) from quotation." + NormoodItemPO.tableName(index) + " where qid = :qid and sid = :sid and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setShort("type", type).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countNormoodItem(int index, long qid, long sid, long quoteld, short type) {

		String sql = "select count(*) from quotation." + NormoodItemPO.tableName(index) + " where qid = :qid and sid = :sid and quoteld = :quoteId and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setLong("quoteId", quoteld).setShort("type", type).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int disableNormoodItem(int index, long qid) {

		String sql = "update quotation." + NormoodItemPO.tableName(index) + " set status = :status where qid = :qid and type != :type";
		session().createSQLQuery(sql).setShort("status", NormoodItemBase.STATUS_DISABLED_INT).setLong("qid", qid).setShort("type", NormoodItemBase.TYPE_QUOTA_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disableNormoodItem(int index, long qid, short type) {

		String sql = "update quotation." + NormoodItemPO.tableName(index) + " set status = :status where qid = :qid and type = :type";
		session().createSQLQuery(sql).setShort("status", NormoodItemBase.STATUS_DISABLED_INT).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int disableNormoodItem(int index, long qid, long sid, short type) {

		String sql = "update quotation." + NormoodItemPO.tableName(index) + " set status = :status where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setShort("status", NormoodItemBase.STATUS_DISABLED_INT).setLong("qid", qid).setLong("sid", sid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int disableNormoodItem(int index, long qid, long sid, long quoteId, short type) {

		String sql = "update quotation." + NormoodItemPO.tableName(index) + " set status = :status where qid = :qid and type = :type and sid = :sid and quoteld = :quoteId";
		session().createSQLQuery(sql).setShort("status", NormoodItemBase.STATUS_DISABLED_INT).setLong("qid", qid).setLong("sid", sid).setLong("quoteId", quoteId).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(int index, long qid, short type) {

		String sql = "delete from quotation." + NormoodItemPO.tableName(index) + " where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(int index, long qid, short type, short status) {

		String sql = "delete from quotation." + NormoodItemPO.tableName(index) + " where qid = :qid and type = :type and status = :status";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", status).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(int index, long qid, long sid, short type) {

		String sql = "delete from quotation." + NormoodItemPO.tableName(index) + " where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormoodItem(int index, long qid, long sid, long quoteId, short type) {

		String sql = "delete from quotation." + NormoodItemPO.tableName(index) + " where sid = :sid and quoteld = :quoteId and type = :type and qid = :qid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setLong("quoteId", quoteId).setShort("type", type).executeUpdate();

		return 0;
	}

}
