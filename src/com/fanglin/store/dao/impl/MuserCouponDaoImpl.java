package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MuserCouponDao;
import com.fanglin.store.po.MuserCouponPO;
import com.fanglin.utils.Paging;

@Repository("muserCouponDao")
public class MuserCouponDaoImpl extends DaoImpl<MuserCouponPO> implements MuserCouponDao {

	public MuserCouponDaoImpl() {
		super(MuserCouponPO.class);
	}

	@Override
	public List<MuserCouponPO> pageMuserCoupon(Paging paging, List<Filter> filters) {

		PagingQuery<MuserCouponPO> query = pagingQuery(paging, MuserCouponPO.class);

		queryFilterExcute(query, filters);

		return query.desc("mcid").list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MuserCouponPO> queryMuserCouponByUnionId(String unionId) {

		return session().createCriteria(MuserCouponPO.class).add(Restrictions.eq("unionId", unionId)).list();
	}

	@Override
	public int updateMuserCouponByCid(long cid) {

		String sql = "UPDATE store.musercoupon SET status = 1 WHERE store.musercoupon.cid = :cid";
		session().createSQLQuery(sql).setLong("cid", cid).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("unionId")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
