package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PointRecordDao;
import com.fanglin.customer.po.PointRecordPO;
import com.fanglin.utils.Paging;

@Repository("pointRecordDao")
public class PointRecordDaoImpl extends DaoImpl<PointRecordPO> implements PointRecordDao {

	public PointRecordDaoImpl() {
		super(PointRecordPO.class);
	}

	@Override
	public List<PointRecordPO> queryPointRecord(Long accountId, Paging paging, List<Filter> filters) {

		PagingQuery<PointRecordPO> query = pagingQuery(paging, PointRecordPO.class);

		query.add(Restrictions.eq(PointRecordPO.COLUMN_ACCOUNTID_STR, accountId));

		return query.list();
	}


	@Override
	public PointRecordPO queryPointRecordByOrderId(String orderId) {
		return (PointRecordPO) session().createCriteria(PointRecordPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("pointType", PointRecordPO.POINTTYPE_DECORATION_INT)).add(Restrictions.eq("status", PointRecordPO.STATUS_ABLE_SHORT)).addOrder(Order.desc("operateTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public void updatePointRecordByNo(String pointOrderId) {
		String sql = "update customer.cppointrecord set status = :status where no = :no";

		session().createSQLQuery(sql).setString("no", pointOrderId).setLong("status", PointRecordPO.STATUS_DISABLE_SHORT).executeUpdate();

	}

	@Override
	public long sumMaterialPoint(long accountId) {

		String sql = "select IFNULL(sum(case when type = :add then point else -point end), 0) from customer.cppointrecord where cpid = :cpid and pointType = :pointType and status = :status";

		Object result = session().createSQLQuery(sql).setLong("cpid", accountId).setShort("add", PointRecordPO.TYPE_ADDUP_INT).setShort("pointType", PointRecordPO.POINTTYPE_SALES_INT).setShort("status", PointRecordPO.STATUS_ABLE_SHORT).uniqueResult();

		return result == null ? 0 : ((Number) result).longValue();
	}

}
