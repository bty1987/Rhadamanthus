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

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.GoodsPoolDao;
import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("goodsPoolDao")
public class GoodsPoolDaoImpl extends DaoImpl<GoodsPoolPO> implements GoodsPoolDao {

	public GoodsPoolDaoImpl() {
		super(GoodsPoolPO.class);
	}

	@Override
	public List<GoodsPoolPO> pageGoodsPool(Paging paging, List<Filter> filters) {

		PagingQuery<GoodsPoolPO> query = pagingQuery(paging, GoodsPoolPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<GoodsPoolPO> queryGoodsPool(List<Filter> filters) {

		PagingQuery<GoodsPoolPO> query = pagingQuery(new Paging(), GoodsPoolPO.class);

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPoolPO> queryGoodsPoolByName(String name, int limit) {

		String likestr = String.format("%%%s%%", name);

		String sql = "SELECT gp.* FROM `communion`.goodsPool gp, communion.brand b WHERE gp.bid = b.bid AND  gp.`status` = :status AND b.`status` = :bStatus AND (gp.`name` LIKE :name OR gp.`no` LIKE :no) LIMIT :limit";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(GoodsPoolPO.class);

		query.setShort("status", GoodsPoolPO.STATUS_ENABLE_INT).setShort("bStatus", GoodsPoolPO.BRAND_STATUS_INT).setString("name", likestr).setString("no", likestr).setInteger("limit", limit);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPoolPO> queryGoodsPoolByNo(String no, int limit) {
		return session().createCriteria(GoodsPoolPO.class).add(Restrictions.eq(GoodsPoolPO.COLUMN_STATUS_STR, GoodsPoolPO.STATUS_ENABLE_INT)).add(Restrictions.ilike(GoodsPoolPO.COLUMN_NO_STR, no, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<GoodsPoolPO> queryGoodsPoolByAtid(long atid) {
		return session().createCriteria(GoodsPoolPO.class).add(Restrictions.eq(GoodsPoolPO.COLUMN_STATUS_STR, GoodsPoolPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPoolPO.COLUMN_ATID_STR, atid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GoodsPoolPO> queryGoodsPoolByBarcode(String barcode, int limit) {
		return session().createCriteria(GoodsPoolPO.class).add(Restrictions.eq(GoodsPoolPO.COLUMN_STATUS_STR, GoodsPoolPO.STATUS_ENABLE_INT)).add(Restrictions.ilike(GoodsPoolPO.COLUMN_BARCODE_STR, barcode, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<GoodsPoolPO> queryGoodsPoolByName(String name) {
		return session().createCriteria(GoodsPoolPO.class).add(Restrictions.eq(GoodsPoolPO.COLUMN_STATUS_STR, GoodsPoolPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPoolPO.COLUMN_NAME_STR, name)).list();
	}

	@Override
	public GoodsPoolPO queryGoodsPoolByNo(String no) {
		return (GoodsPoolPO) session().createCriteria(GoodsPoolPO.class).add(Restrictions.eq(GoodsPoolPO.COLUMN_STATUS_STR, GoodsPoolPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPoolPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	@Override
	public GoodsPoolPO queryGoodsPoolByBarcode(String barcode) {
		return (GoodsPoolPO) session().createCriteria(GoodsPoolPO.class).add(Restrictions.eq(GoodsPoolPO.COLUMN_STATUS_STR, GoodsPoolPO.STATUS_ENABLE_INT)).add(Restrictions.eq(GoodsPoolPO.COLUMN_BARCODE_STR, barcode)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (GoodsPoolPO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (GoodsPoolPO.COLUMN_NO_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (GoodsPoolPO.COLUMN_BARCODE_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (GoodsPoolPO.COLUMN_CATEGORY_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (GoodsPoolPO.COLUMN_BRAND_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if (GoodsPoolPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(Restrictions.eq(field, Short.valueOf(filter.getData())));
				} else if("atttype".equals(field)){
					query.add(Restrictions.eq(field, Short.valueOf(filter.getData())));
				}
			}
		}
	}

}
