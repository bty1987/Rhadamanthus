package com.fanglin.construction.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.MaterialPlanDao;
import com.fanglin.construction.po.MaterialPlanPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("materialPlanDao")
public class MaterialPlanDaoImpl extends DaoImpl<MaterialPlanPO> implements MaterialPlanDao {

	public MaterialPlanDaoImpl() {
		super(MaterialPlanPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPlanPO> queryMaterialPlanByOrderId(String orderId) {
		return session().createCriteria(MaterialPlanPO.class).add(Restrictions.eq(MaterialPlanPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.asc("mpid")).list();
	}

	@Override
	public int countMaterialPlan(String orderId) {

		String sql = "select count(*) from construction.materialplan where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> queryMaterialSalesByOrderId(String orderId) {

		// tinyint 一律 cast as signed: 原生结果集 tinyint(1) 会被映射为 Boolean 导致强转失败
		String sql = "select s.sid, s.createTime, s.category, s.bid, b.name from sales.sales s left join communion.brand b on b.bid = s.bid where s.orderId = :orderId and cast(s.status as signed) in (0, 5)";

		return session().createSQLQuery(sql).setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> queryMaterialDeliveryByOrderId(String orderId) {

		String sql = "select di.sid, cast(di.status as signed), di.tranTime, di.confirmTime, di.bid, g.bid, g.category from sales.salesdeliveryitem di join sales.sales s on s.sid = di.sid left join data.goods g on g.gid = di.gid where s.orderId = :orderId";

		return session().createSQLQuery(sql).setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> queryMaterialSelectionByOrderId(String orderId) {

		String sql = "select cast(si.status as signed), si.tranTime, si.confirmTime, g.bid, g.category from quotation.selectionitem si left join data.goods g on g.gid = si.gid where si.orderId = :orderId and cast(si.status as signed) between 1 and 6";

		return session().createSQLQuery(sql).setString("orderId", orderId).list();
	}

}
