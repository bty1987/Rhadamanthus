package com.fanglin.quotation.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.NormriceItemBase;

@Repository("quotationNormriceItemDao")
public class NormriceItemDaoImpl extends DaoImpl<NormriceItemBase> implements NormriceItemDao {

	public NormriceItemDaoImpl() {
		super(NormriceItemBase.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormriceItemBase> queryNormriceItem(int index, long qid) {
		return session().createCriteria(NormriceItemPO.factoryToClazz(index)).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("status", NormriceItemBase.STATUS_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormriceItemBase> queryNormriceItemByType(int index, long qid, short type) {
		return session().createCriteria(NormriceItemPO.factoryToClazz(index)).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("type", type)).add(Restrictions.in("status", new Short[] { NormriceItemBase.STATUS_INIT_INT, NormriceItemBase.STATUS_CONFIRMED_INT })).list();
	}

	@Override
	public NormriceItemBase queryNormriceItem(int index, long sid, long quoteId, long npid, short type) {
		return (NormriceItemBase) session().createCriteria(NormriceItemPO.factoryToClazz(index)).add(Restrictions.eq("sid", sid)).add(Restrictions.eq("quoteld", quoteId)).add(Restrictions.eq("npid", npid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public NormriceItemBase getNormriceItem(int index, long npiid) {
		return (NormriceItemBase) session().createCriteria(NormriceItemPO.factoryToClazz(index)).add(Restrictions.eq("npiid", npiid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int amountNormriceItem(int index, long qid, long cnid) {

		String sql = "select sum(if(atttype = 0, salary, -salary)*if(trannum = 0, 1, num/1000*trannum/1000)) from quotation.%s where qid =:qid and cnid = :cnid and status = :status";
		sql = String.format(sql, NormriceItemPO.tableName(index));
		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("status", NormriceItemBase.STATUS_INIT_INT).uniqueResult();

		return amount == null ? 0 : amount.intValue();
	}

	@Override
	public int amountNormriceItemForSalary(int index, long qid, long cnid) {

		String sql = "select sum(if(atttype = 0, salary, -salary)*if(trannum = 0, 1, num/1000*trannum/1000)) from quotation.%s where qid = :qid and cnid = :cnid and ((status = :statusInit and type != :typeQuota) or (status = :statusConfirmed and type = :typeQuota and normtype = :normtypeAdd))";
		sql = String.format(sql, NormriceItemPO.tableName(index));
		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("statusInit", NormriceItemBase.STATUS_INIT_INT).setShort("statusConfirmed", NormriceItemBase.STATUS_CONFIRMED_INT).setShort("typeQuota", NormriceItemBase.TYPE_QUOTA_INT).setShort("normtypeAdd", NormriceItemBase.NORMTYPE_ADD_INT).uniqueResult();

		return amount == null ? 0 : amount.intValue();
	}

	@Override
	public int countNormoodItem(int index, long qid, long cnid) {

		// 仅统计 type=QUOTA(附加项) 且 status=INIT(待确认) 的记录
		// 普通报价项(type=OFFER/EXPAND/ADDCUT) 天然 status=0, 不得计入附加项待审判定, 否则会导致
		// constructionschedule.additemStatus 确认/驳回后无法重置回 0
		String sql = "select count(*) from quotation.%s where qid = :qid and cnid = :cnid and type = :type and status = :status";
		sql = String.format(sql, NormriceItemPO.tableName(index));
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("qid", qid).setLong("cnid", cnid).setShort("type", NormriceItemBase.TYPE_QUOTA_INT).setShort("status", NormriceItemBase.STATUS_INIT_INT).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int disabledNormriceItem(int index, long qid) {

		String sql = "update quotation." + NormriceItemPO.tableName(index) + " set status = :status where qid = :qid and type != :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("status", NormriceItemBase.STATUS_DISABLED_INT).setShort("type", NormriceItemBase.TYPE_QUOTA_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormriceItem(int index, long qid, short type) {

		String sql = "update quotation." + NormriceItemPO.tableName(index) + " set status = :status where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", NormriceItemBase.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormriceItem(int index, long qid, long sid, short type) {

		String sql = "update quotation." + NormriceItemPO.tableName(index) + " set status = :status where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).setShort("status", NormriceItemBase.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int disabledNormriceItem(int index, long qid, long sid, long quoteId, short type) {

		String sql = "update quotation." + NormriceItemPO.tableName(index) + " set status = :status where qid = :qid and type = :type and sid = :sid and quoteId = :quoteId";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setLong("sid", sid).setLong("quoteId", quoteId).setShort("status", NormriceItemBase.STATUS_DISABLED_INT).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(int index, long qid, short type) {

		String sql = "delete from quotation." + NormriceItemPO.tableName(index) + " where qid = :qid and type = :type";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(int index, long qid, short type, short status) {

		String sql = "delete from quotation." + NormriceItemPO.tableName(index) + " where qid = :qid and type = :type and status = :status";
		session().createSQLQuery(sql).setLong("qid", qid).setShort("type", type).setShort("status", status).executeUpdate();

		return 0;
	}

	@Override
	public int deleteNormriceItem(int index, long qid, long sid, short type) {

		String sql = "delete from quotation." + NormriceItemPO.tableName(index) + " where qid = :qid and type = :type and sid = :sid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("sid", sid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int confirmNormriceItem(int index, long qid, long npiid, String confirmer) {

		// qid+主键双键: 路由后表内主键定位
		String sql = "update quotation." + NormriceItemPO.tableName(index) + " set status = :status, confirmer = :confirmer, confirmTime = now() where qid = :qid and npiid = :npiid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("npiid", npiid).setShort("status", NormriceItemBase.STATUS_CONFIRMED_INT).setString("confirmer", confirmer).executeUpdate();

		return 0;
	}

	@Override
	public int rejectNormriceItem(int index, long qid, long npiid) {

		String sql = "update quotation." + NormriceItemPO.tableName(index) + " set status = :status where qid = :qid and npiid = :npiid";
		session().createSQLQuery(sql).setLong("qid", qid).setLong("npiid", npiid).setShort("status", NormriceItemBase.STATUS_REJECTED_INT).executeUpdate();

		return 0;
	}

}
