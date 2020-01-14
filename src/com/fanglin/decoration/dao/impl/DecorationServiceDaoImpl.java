package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationServiceDao;
import com.fanglin.decoration.po.DecorationServicePO;

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

}
