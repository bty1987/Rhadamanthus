package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesPreFollowupDao;
import com.fanglin.sales.po.SalesPreFollowupPO;

@Repository("salesPreFollowupDao")
public class SalesPreFollowupDaoImpl extends DaoImpl<SalesPreFollowupPO> implements SalesPreFollowupDao {

	public SalesPreFollowupDaoImpl() {
		super(SalesPreFollowupPO.class);
	}

	@Override
	public List<SalesPreFollowupPO> querySalesPreFollowupByOrderId(String orderId) {

		return session().createCriteria(SalesPreFollowupPO.class).add(Restrictions.eq(SalesPreFollowupPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(SalesPreFollowupPO.COLUMN_ISDELETE_STR, SalesPreFollowupPO.ISDELETE_ENABLE_INT)).addOrder(Order.desc("createTime")).list();
	}

	@Override
	public Object[] countSalesPreFollowup(String orderId) {

		String sql = "select count(*), max(createTime), sum(case when planTime < curdate() then 1 else 0 end) from sales.salesprefollowup where orderId = :orderId and isDelete = :isDelete";

		return (Object[]) session().createSQLQuery(sql).setString(SalesPreFollowupPO.COLUMN_ORDERID_STR, orderId).setShort(SalesPreFollowupPO.COLUMN_ISDELETE_STR, SalesPreFollowupPO.ISDELETE_ENABLE_INT).uniqueResult();
	}

}
