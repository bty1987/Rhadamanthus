package com.fanglin.decoration.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationServiceDao;
import com.fanglin.decoration.po.DecorationServiceDO;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.utils.Paging;

@Repository("DecorationServiceDao")
public class DecorationServiceDaoImpl extends DaoImpl<DecorationServicePO> implements DecorationServiceDao {

	public DecorationServiceDaoImpl() {
		super(DecorationServicePO.class);
	}

	@Override
	public List<DecorationServiceDO> pageDecorationService(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationServiceDO> query = pagingQuery(paging, DecorationServiceDO.class);

		queryFilterExcute(query, filters);

		query.desc("dsid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationServicePO> queryDecorationServiceByOrderId(String orderId) {
		return session().createCriteria(DecorationServicePO.class).add(Restrictions.eq(DecorationServicePO.DECORATION_ORDERID_STR, orderId)).list();
	}

	@Override
	public DecorationServicePO queryDecorationService(String orderId, short type) {
		return (DecorationServicePO) session().createCriteria(DecorationServicePO.class).add(Restrictions.eq(DecorationServicePO.DECORATION_ORDERID_STR, orderId)).add(Restrictions.eq("type", type)).addOrder(org.hibernate.criterion.Order.desc("createTime")).setMaxResults(1).uniqueResult();
	}

	@Override
	public int makeDecorationService(short type, String orderId, int ouid) {

		String sql = "insert into decoration.decorationservice (orderId, name, detail, dsuid) select :orderId, name, detail, :ouid FROM communion.servicenode WHERE type = :type and status = 0";

		session().createSQLQuery(sql).setString("orderId", orderId).setLong("ouid", ouid).setShort("type", type).executeUpdate();

		return 0;
	}

	@Override
	public int updateDecorationService(String orderId, Timestamp finishTime) {

		String sql = "update decoration.decorationService set status = :status, finishTime = :finishTime where orderId = :orderId and type = :type and status = :initStatus";

		return session().createSQLQuery(sql).setShort("status", DecorationServicePO.SERVICESTATUS_FINISH_INT).setTimestamp("finishTime", finishTime).setString("orderId", orderId).setShort("type", DecorationServicePO.TYPE_DESIGN_CONFIRM).setShort("initStatus", DecorationServicePO.SERVICESTATUS_INIT_INT).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");
	}

}
