package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AoodsChargeDao;
import com.fanglin.data.po.AoodsChargePO;
import com.fanglin.utils.Paging;

@Repository("aoodsChargeDao")
public class AoodsChargeDaoImpl extends DaoImpl<AoodsChargePO> implements AoodsChargeDao {

	public AoodsChargeDaoImpl() {
		super(AoodsChargePO.class);
	}

	@Override
	public List<AoodsChargePO> pageAoodsCharge(Paging paging, List<Filter> filters, Long aid) {
		PagingQuery<AoodsChargePO> query = pagingQuery(paging, AoodsChargePO.class);
		query.alias("aoods", "aoods");

		if (aid != null) {
			query.add(query.getCriterion("aoods.aid", aid, "eq"));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AoodsChargePO> queryAoodsChargeByAid(Long aid, Short type) {

		Criteria query = session().createCriteria(AoodsChargePO.class).createAlias("aoods", "aoods");

		query.add(Restrictions.eq("aoods.aid", aid));
		query.add(Restrictions.eq("status", AoodsChargePO.STATUS_ENABLE_SHORT));

		// 如果传入了 type 参数，则添加类型过滤条件
		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		query.addOrder(Order.asc("sort"));

		return query.list();
	}
}
