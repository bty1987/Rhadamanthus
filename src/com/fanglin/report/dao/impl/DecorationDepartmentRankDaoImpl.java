/**
 * @File Name		: DecorationDepartmentRankDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.DecorationDepartmentRankDao;
import com.fanglin.report.po.DecorationDepartmentRankPO;

@Repository("decorationDepartmentRankDao")
public class DecorationDepartmentRankDaoImpl extends DaoImpl<DecorationDepartmentRankPO> implements DecorationDepartmentRankDao {

	public DecorationDepartmentRankDaoImpl() {
		super(DecorationDepartmentRankPO.class);
	}

	@Override
	public DecorationDepartmentRankPO queryDecorationDepartmentRankForInitByDeptId(String deptId, int company) {

		return (DecorationDepartmentRankPO) session().createCriteria(DecorationDepartmentRankPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(DecorationDepartmentRankPO.COLUMN_STATUS_STR, DecorationDepartmentRankPO.STATUS_TYPE_INIT_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationDepartmentRankPO> queryDecorationDepartmentRankForTop(int top, int month, Integer ddid, Integer drid, Short type, int company) {

		Criteria criteria = session().createCriteria(DecorationDepartmentRankPO.class).add(Restrictions.eq("month", month)).add(Restrictions.eq("company", company)).add(Restrictions.eq(DecorationDepartmentRankPO.COLUMN_STATUS_STR, DecorationDepartmentRankPO.STATUS_TYPE_INIT_INT)).addOrder(Order.desc(DecorationDepartmentRankPO.COLUMN_RANK_STR));

		if (ddid != null) {
			criteria.createAlias("depte", "depte").add(Restrictions.eq("depte.did", ddid));
		}

		if (drid != null) {
			criteria.createAlias("region", "region").add(Restrictions.eq("region.did", drid));
		}

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		if (top >= 0) {
			criteria.setFirstResult(0).setMaxResults(top);
		}

		return criteria.list();
	}
}
