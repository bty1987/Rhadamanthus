package com.fanglin.decoration.dao.impl;

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
	public int makeDecorationService(short type, String orderId, int ouid) {

		String sql = "insert into decoration.decorationservice (orderId, name, detail, dsuid) select :orderId, name, detail, :ouid FROM communion.servicenode WHERE type = :type and status = 0";

		session().createSQLQuery(sql).setString("orderId", orderId).setLong("ouid", ouid).setShort("type", type).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");
	}

}
