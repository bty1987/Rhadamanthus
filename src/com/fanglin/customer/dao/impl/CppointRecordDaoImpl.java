package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.utils.Paging;

@Repository("cppointRecordDao")
public class CppointRecordDaoImpl extends DaoImpl<CppointRecordPO> implements CppointRecordDao {

	public CppointRecordDaoImpl() {
		super(CppointRecordPO.class);
	}

	@Override
	public List<CppointRecordPO> queryCppointRecord(Long cpid, Paging paging, List<Filter> filters) {

		PagingQuery<CppointRecordPO> query = pagingQuery(paging, CppointRecordPO.class);

		query.add(Restrictions.eq(CppointRecordPO.COLUMN_CPID_STR, cpid));

		return query.list();
	}


	@Override
	public CppointRecordPO queryCppointRecordByOrderId(String orderId) {
		return (CppointRecordPO) session().createCriteria(CppointRecordPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("pointType", CppointRecordPO.POINTTYPE_DECORATION_INT)).add(Restrictions.eq("status", CppointRecordPO.STATUS_ABLE_SHORT)).addOrder(Order.desc("operateTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public void updateCppointRecordByNo(String pointOrderId) {
		String sql = "update customer.cppointrecord set status = :status where no = :no";

		session().createSQLQuery(sql).setString("no", pointOrderId).setLong("status", CppointRecordPO.STATUS_DISABLE_SHORT).executeUpdate();
		
	}

}
