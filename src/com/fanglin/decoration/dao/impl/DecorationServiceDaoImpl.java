package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationServiceDao;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.utils.Paging;
import com.fanglin.core.vo.Filter;

@Repository("DecorationServiceDao")
public class DecorationServiceDaoImpl extends DaoImpl<DecorationServicePO> implements DecorationServiceDao {

	public DecorationServiceDaoImpl() {
		super(DecorationServicePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationServicePO> queryDecorationServiceByOrderId(String orderId) {
		return session().createCriteria(DecorationServicePO.class).add(Restrictions.eq(DecorationServicePO.DECORATION_ORDERID_STR, orderId)).list();
	}

	@Override
	public int makeDecorationService(short type, String orderId, int ouid) {

		String sql = "insert into decoration.decorationservice (orderId, name, detail, dsuid) select :orderId, name, detail, :ouid FROM communion.servicenode WHERE type = :type and status = 0";

		session().createSQLQuery(sql).setString("orderId", orderId).setLong("ouid", ouid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public List<DecorationServicePO> pageDecorationService(Paging paging, List<Filter> filters, int company) throws FLException {

		// 先查询符合条件的装修订单
		List<String> orderIds = queryValidOrderIds(company);

		if (orderIds == null || orderIds.isEmpty()) {
			return java.util.Collections.emptyList();
		}

		PagingQuery<DecorationServicePO> query = pagingQuery(paging, DecorationServicePO.class);

		// 只查询有效装修订单的服务记录
		query.add(Restrictions.in(DecorationServicePO.DECORATION_ORDERID_STR, orderIds));

		// 执行过滤条件
		queryFilterExcute(query, filters);

		// 按装修单号和服务ID排序
		query.add(Restrictions.eq("status", DecorationServicePO.SERVICESTATUS_INIT_INT)).desc("orderId").desc("dsid");

		return query.list();
	}

	/**
	 * 查询有效的装修订单ID
	 */
	@SuppressWarnings("unchecked")
	private List<String> queryValidOrderIds(int company) {
		String hql = "SELECT DISTINCT d.doid FROM com.fanglin.decoration.po.DecorationPO d " +
					"WHERE d.company = :company " +
					"AND d.status NOT IN (:terminatedStatus, :wasteStatus)";

		return session().createQuery(hql)
				.setParameter("company", company)
				.setParameter("terminatedStatus", com.fanglin.decoration.po.DecorationPO.STATUS_TERMINATION_INT)
				.setParameter("wasteStatus", com.fanglin.decoration.po.DecorationPO.STATUS_WASTE_INT)
				.list();
	}

}
