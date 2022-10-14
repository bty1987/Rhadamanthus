package com.fanglin.data.material.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.SoodsItemDao;
import com.fanglin.data.po.SoodsItemPO;
import com.fanglin.utils.Paging;

@Repository("soodsItemDao")
public class SoodsItemDaoImpl extends DaoImpl<SoodsItemPO> implements SoodsItemDao {

	public SoodsItemDaoImpl() {
		super(SoodsItemPO.class);
	}

	@Override
	public List<SoodsItemPO> pageSoodsItem(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SoodsItemPO> query = pagingQuery(paging, SoodsItemPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<SoodsItemPO> pageSoodsItemByQiid(Paging paging, List<Filter> filters, long qiid, Short status) {

		PagingQuery<SoodsItemPO> query = pagingQuery(paging, SoodsItemPO.class);

		query.alias("quotationItem", "quotationItem");
		query.add(query.getCriterion("quotationItem.qiid", qiid, "eq"));

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<SoodsItemPO> pageSoodsItemBySid(Paging paging, List<Filter> filters, long sid, Short status) {

		PagingQuery<SoodsItemPO> query = pagingQuery(paging, SoodsItemPO.class);

		query.alias("soods", "soods");
		query.add(query.getCriterion("soods.sid", sid, "eq"));

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SoodsItemPO> querySoodsItemByQiid(long qiid) {
		return session().createCriteria(SoodsItemPO.class).createAlias("quotationItem", "quotationItem").createAlias("soods", "soods").add(Restrictions.eq(SoodsItemPO.COLUMN_QIID_STR, qiid)).add(Restrictions.eq("soods.status", SoodsItemPO.STATUS_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SoodsItemPO> querySoodsItemBySid(long sid) {
		return session().createCriteria(SoodsItemPO.class).createAlias("soods", "soods").createAlias("quotationItem", "quotationItem").add(Restrictions.eq(SoodsItemPO.COLUMN_SID_STR, sid)).add(Restrictions.eq("soods.status", SoodsItemPO.STATUS_INIT_INT)).list();

	}

	@Override
	public int countSoodsItem(long gid, long qiid) {

		String sql = "SELECT COUNT(*) FROM `data`.soods,`data`.soodsitem  WHERE soods.sid=soodsitem.sid AND soods.gid = :gid AND soodsitem.qiid = :qiid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("gid", gid).setLong("qiid", qiid).uniqueResult();

		return count.intValue();
	}

	@Override
	public int copySoodsItem(long sqiid, long tqiid) {

		String sql = "insert into data.soodsitem (sid, qiid) select sid,:tqiid company from data.soodsitem where qiid = :sqiid";

		session().createSQLQuery(sql).setLong("tqiid", tqiid).setLong("sqiid", sqiid).executeUpdate();

		return 0;
	}

	@Override
	public int deleteSoodsItem(long sid, long qiid) {

		String sql = "delete from data.soodsitem where sid = :sid AND qiid = :qiid";
		session().createSQLQuery(sql).setLong("sid", sid).setLong("qiid", qiid).executeUpdate();

		return 0;
	}

	@Override
	public int deleteSoodsItem(long sid) {

		String sql = "delete from data.soodsitem where sid = :sid";
		session().createSQLQuery(sql).setLong("sid", sid).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<SoodsItemPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (SoodsItemPO.COLUMN_NAME_STR.equals(field)) {
				query.alias("soods", "soods");
				query.alias("soods.goods", "goods");
				query.add(query.getCriterion("goods.name", data, op));
			} else if (SoodsItemPO.COLUMN_BRAND_STR.equals(field)) {
				query.alias("soods", "soods");
				query.alias("soods.goods", "goods");
				query.add(query.getCriterion("goods.brand", data, op));
			} else if (SoodsItemPO.COLUMN_CATEGORY_STR.equals(field)) {
				query.alias("soods", "soods");
				query.alias("soods.goods", "goods");
				query.add(query.getCriterion("goods.category", data, op));
			} else if (SoodsItemPO.COLUMN_VERSION_STR.equals(field)) {
				query.alias("quotationItem", "quotationItem");
				query.add(query.getCriterion(SoodsItemPO.COLUMN_VERSION_STR, data, op));
			} else if (SoodsItemPO.COLUMN_QNAME_STR.equals(field)) {
				query.alias("quotationItem", "quotationItem");
				query.add(query.getCriterion(SoodsItemPO.COLUMN_QNAME_STR, data, op));
			} else if (SoodsItemPO.COLUMN_QUOTATIONSMALLCATEGORYID_STR.equals(field)) {
				query.alias("quotationItem", "quotationItem");
				query.alias("quotationItem.quotationSmallCategory", "quotationSmallCategory");
				query.add(query.getCriterion(SoodsItemPO.COLUMN_QUOTATIONSMALLCATEGORYID_STR, Integer.valueOf(data), op));
			}
		}
	}

}
