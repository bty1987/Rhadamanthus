package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesProfileItemDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesProfileItemPO;

@Repository("salesProfileItemDao")
public class SalesProfileItemDaoImpl extends DaoImpl<SalesProfileItemPO> implements SalesProfileItemDao {

	public SalesProfileItemDaoImpl() {
		super(SalesProfileItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPO> querySalesByOrderId(String orderId) {

		String sql = "select s.* from sales.sales s left join sales.salesprofile sp on s.orderId = sp.orderId left join sales.salesprofileitem spi on sp.spid = spi.spid and spi.bid = s.bid where s.orderId= :orderId and spi.spiid is null ";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).addEntity(SalesPO.class).setString("orderId", orderId);

		return query.list();
	}

}
