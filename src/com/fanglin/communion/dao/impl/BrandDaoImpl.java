/**
 * @File Name		: BrandDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("brandDao")
public class BrandDaoImpl extends DaoImpl<BrandPO> implements BrandDao {

	public BrandDaoImpl() {
		super(BrandPO.class);
	}

	@Override
	public List<BrandPO> pageBrand(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<BrandPO> query = pagingQuery(paging, BrandPO.class);

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<BrandPO> pageBrand(Paging paging, String pinyin, Short atttype, Short status, Integer company) {

		PagingQuery<BrandPO> query = pagingQuery(paging, BrandPO.class);

		query.add(Restrictions.or(Restrictions.ilike(BrandPO.COLUMN_NAME_STR, pinyin, MatchMode.ANYWHERE), Restrictions.ilike(BrandPO.COLUMN_PINYIN_STR, pinyin, MatchMode.ANYWHERE)));

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		if (atttype != null) {
			query.add(Restrictions.eq("atttype", atttype));
		}

		if (atttype != null) {
			query.add(Restrictions.eq("status", status));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandPO> queryBrandByCid(long cid) {
		return session().createCriteria(BrandPO.class).createAlias("category", "category").add(Restrictions.eq("category.cid", cid)).add(Restrictions.eq("status", BrandPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public BrandPO queryBrandByBid(long bid) {
		return (BrandPO) session().createCriteria(BrandPO.class).add(Restrictions.eq(BrandPO.COLUMN_BID_INT, bid)).uniqueResult();
	}

	@Override
	public BrandPO queryBrandByNo(String no) {
		return (BrandPO) session().createCriteria(BrandPO.class).add(Restrictions.eq(BrandPO.COLUMN_NO_STR, no)).uniqueResult();
	}

	@Override
	public BrandPO queryBrand(String kino) {
		return (BrandPO) session().createCriteria(BrandPO.class).add(Restrictions.eq(BrandPO.COLUMN_KINO_STR, kino)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (BrandPO.COLUMN_CATEGORYNO_STR.equals(field)) {
				query.add(query.getCriterion("category.cid", Long.valueOf(data), op));
			} else if (BrandPO.COLUMN_STATUS_ATTTYPE.equals(field)) {
				query.add(Restrictions.eq("atttype", Short.valueOf(filter.getData())));
			} else {
				query.add(query.getCriterion(field, filter.getData(), op));
			}
		}
	}
}
