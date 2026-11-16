package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesPostFollowupDao;
import com.fanglin.sales.po.SalesPostFollowupPO;

@Repository("salesPostFollowupDao")
public class SalesPostFollowupDaoImpl extends DaoImpl<SalesPostFollowupPO> implements SalesPostFollowupDao {

	public SalesPostFollowupDaoImpl() {
		super(SalesPostFollowupPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPostFollowupPO> querySalesPostFollowupBySid(long sid) {
		return session().createCriteria(SalesPostFollowupPO.class).add(Restrictions.eq(SalesPostFollowupPO.COLUMN_SID_STR, sid)).add(Restrictions.eq(SalesPostFollowupPO.COLUMN_ISDELETE_STR, SalesPostFollowupPO.ISDELETE_ENABLE_INT)).addOrder(Order.desc("createTime")).list();
	}

	@Override
	public Object[] countSalesPostFollowup(long sid) {

		String sql = "select count(*), max(createTime), sum(case when planTime < curdate() then 1 else 0 end) from sales.salespostfollowup where sid = :sid and isDelete = :isDelete";

		return (Object[]) session().createSQLQuery(sql).setLong(SalesPostFollowupPO.COLUMN_SID_STR, sid).setShort(SalesPostFollowupPO.COLUMN_ISDELETE_STR, SalesPostFollowupPO.ISDELETE_ENABLE_INT).uniqueResult();
	}

}
