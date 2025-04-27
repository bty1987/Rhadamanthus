/**
 * @File Name		: GoodsDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.utils.Paging;

@Repository("goodsDao")
public class GoodsDaoImpl extends DaoImpl<GoodsPO> implements GoodsDao {

	public GoodsDaoImpl() {
		super(GoodsPO.class);
	}

	@Override
	public List<GoodsPO> pageGoods(Paging paging, List<Filter> filters, List<Long> bids, int company) {

		PagingQuery<GoodsPO> query = pagingQuery(paging, GoodsPO.class);

		query.add(query.getCriterion(GoodsPO.COLUMN_BID_STR, bids, "in"));
		query.add(query.getCriterion(GoodsPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<GoodsPO> pageGoodsForAdvance(Paging paging, List<Filter> filters, int company) {

		PagingQuery<GoodsPO> query = pagingQuery(paging, GoodsPO.class);

		query.add(query.getCriterion(GoodsPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<GoodsPO> queryGoods(List<Filter> filters, int company) {

		PagingQuery<GoodsPO> query = pagingQuery(new Paging(), GoodsPO.class);

		query.add(query.getCriterion(GoodsPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByName(String name, int limit, int company) {

		String likestr = String.format("%%%s%%", name);

		String sql = "SELECT g.* FROM `data`.goods g, communion.brand b WHERE g.bid = b.bid AND  g.`status` = :status AND b.`status` = :bStatus AND (g.`name` LIKE :name OR g.`no` LIKE :no) AND g.company = :company LIMIT :limit";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(GoodsPO.class);

		query.setShort("status", GoodsPO.STATUS_ENABLE_INT).setShort("bStatus", GoodsPO.BRAND_STATUS_INT).setString("name", likestr).setString("no", likestr).setInteger("company", company).setInteger("limit", limit);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByNo(String no, int limit, int company) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.ilike(GoodsPO.COLUMN_NO_STR, no, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<GoodsPO> queryGoodsByAtid(long atid) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_ATID_STR, atid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByBarcode(String barcode, int limit, int company) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.ilike(GoodsPO.COLUMN_BARCODE_STR, barcode, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<GoodsPO> queryGoodsByName(String name, int company) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_NAME_STR, name)).list();
	}

	@Override
	public GoodsPO queryGoodsByNo(String no, int company) {
		return (GoodsPO) session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	@Override
	public GoodsPO queryGoodsByBarcode(String barcode, int company) {
		return (GoodsPO) session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(GoodsPO.COLUMN_STATUS_STR, GoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPO.COLUMN_BARCODE_STR, barcode)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPO> queryGoodsByGpid(Long gpid) {
		return session().createCriteria(GoodsPO.class).add(Restrictions.eq(GoodsPO.COLUMN_GPID_STR, gpid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (GoodsPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(GoodsPO.COLUMN_NAME_STR, data, op));
			} else if (GoodsPO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion(GoodsPO.COLUMN_NO_STR, data, op));
			} else if (GoodsPO.COLUMN_BARCODE_STR.equals(field)) {
				query.add(query.getCriterion(GoodsPO.COLUMN_BARCODE_STR, data, op));
			} else if (GoodsPO.COLUMN_CATEGORY_STR.equals(field)) {
				query.add(query.getCriterion(GoodsPO.COLUMN_CATEGORY_STR, data, op));
			} else if (GoodsPO.COLUMN_BRAND_STR.equals(field)) {
				query.add(query.getCriterion(GoodsPO.COLUMN_BRAND_STR, data, op));
			} else if (GoodsPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			}
		}
	}

}
