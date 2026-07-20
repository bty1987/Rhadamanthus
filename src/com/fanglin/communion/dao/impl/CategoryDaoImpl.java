/**
 * @File Name		: CategoryDaoImpl.java
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

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("categoryDao")
public class CategoryDaoImpl extends DaoImpl<CategoryPO> implements CategoryDao {

	public CategoryDaoImpl() {
		super(CategoryPO.class);
	}

	@Override
	public List<CategoryPO> pageCategory(Paging paging, List<Filter> filters) {

		PagingQuery<CategoryPO> query = pagingQuery(paging, CategoryPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CategoryPO> queryCategory(Short isCoupon, Short isCount) {

		Criteria query = session().createCriteria(CategoryPO.class);

		if (isCoupon != null) {
			query.add(Restrictions.eq(CategoryPO.COLUMN_ISCOUPON_STR, isCoupon));
		}

		if (isCount != null) {
			query.add(Restrictions.eq(CategoryPO.COLUMN_ISCOUNT_STR, isCount));
		}

		return query.list();
	}

	@Override
	public CategoryPO queryCategoryByCId(long cid) {
		return (CategoryPO) session().createCriteria(CategoryPO.class).add(Restrictions.eq(CategoryPO.COLUMN_CID_STR, cid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public CategoryPO queryCategoryByCategoryId(String no) {
		return (CategoryPO) session().createCriteria(CategoryPO.class).add(Restrictions.eq(CategoryPO.COLUMN_NO_STR, no)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			} else if (CategoryPO.COLUMN_ISCOUPON_STR.equals(field)) {
				query.add(Restrictions.eq("isCoupon", Short.valueOf(data)));
			} else if (CategoryPO.COLUMN_ISCOUNT_STR.equals(field)) {
				query.add(Restrictions.eq("isCount", Short.valueOf(data)));
			}
		}
	}

}
