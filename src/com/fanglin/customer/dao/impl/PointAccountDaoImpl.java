package com.fanglin.customer.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PointAccountDao;
import com.fanglin.customer.po.PointAccountPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("pointAccountDao")
public class PointAccountDaoImpl extends DaoImpl<PointAccountPO> implements PointAccountDao {

	@Override
	public List<PointAccountPO> pagePointAccount(Paging paging, List<Filter> filters) {

		PagingQuery<PointAccountPO> query = pagingQuery(paging, PointAccountPO.class);

		return query.list();
	}

	@Override
	public PointAccountPO queryPointAccount(long cid) {
		return (PointAccountPO) session().createCriteria(PointAccountPO.class).add(Restrictions.eq(PointAccountPO.COLUMN_CID_STR, cid)).uniqueResult();
	}

	@Override
	public PointAccountPO queryPointAccountByOrderId(String orderId) {
		return (PointAccountPO) session().createCriteria(PointAccountPO.class).add(Restrictions.eq(PointAccountPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public long amountDecorationPoint(String orderId) {

		SQLQuery query = session().createSQLQuery("SELECT COALESCE(SUM(IF(type = 1, point, -point)), 0) AS priceSum FROM customer.cppointrecord WHERE orderId =:orderId and pointtype = 0");

		BigDecimal amount = (BigDecimal) query.setString("orderId", orderId).uniqueResult();

		return Arith.div(amount.longValue(), 1000);
	}

	@Override
	public long amountMaterialPoint(String orderId) {

		SQLQuery query = session().createSQLQuery("SELECT COALESCE(SUM(IF(type = 1, point, -point)), 0) AS priceSum FROM customer.cppointrecord WHERE orderId =:orderId and pointtype = 1");

		BigDecimal amount = (BigDecimal) query.setString("orderId", orderId).uniqueResult();

		return Arith.div(amount.longValue(), 1000);
	}
}
