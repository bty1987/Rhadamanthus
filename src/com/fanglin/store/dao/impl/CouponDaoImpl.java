package com.fanglin.store.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.CouponDao;
import com.fanglin.store.po.CouponPO;
import com.fanglin.utils.Paging;

@Repository("couponDao")
public class CouponDaoImpl extends DaoImpl<CouponPO> implements CouponDao {

	public CouponDaoImpl() {
		super(CouponPO.class);
	}

	@Override
	public List<CouponPO> pageCoupon(Paging paging, List<Filter> filters) {

		PagingQuery<CouponPO> query = pagingQuery(paging, CouponPO.class);

		queryFilterExcute(query, filters);

		return query.desc("cid").list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("status")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("mgoods".equals(field)) {
				query.alias("mgoods", "mgoods");
				query.add(query.getCriterion("mgoods.no", data, op));
			}
		}
	}

}
