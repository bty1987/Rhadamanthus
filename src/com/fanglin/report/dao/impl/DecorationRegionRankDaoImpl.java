/**
 * @File Name		: DecorationRankDaoImpl.java
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
import com.fanglin.report.dao.DecorationRegionRankDao;
import com.fanglin.report.po.DecorationRegionRankPO;

@Repository("decorationRegionRankDao")
public class DecorationRegionRankDaoImpl extends DaoImpl<DecorationRegionRankPO> implements DecorationRegionRankDao {

	public DecorationRegionRankDaoImpl() {
		super(DecorationRegionRankPO.class);
	}

	@Override
	public DecorationRegionRankPO queryDecorationRegionRankForInitByRegionId(String regionId, int company) {
		return (DecorationRegionRankPO) session().createCriteria(DecorationRegionRankPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(DecorationRegionRankPO.COLUMN_STATUS_STR, DecorationRegionRankPO.STATUS_TYPE_INIT_INT)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationRegionRankPO> queryDecorationRegionRankForTop(int top, int month, Integer drid, Short type, int company) {

		Criteria criteria = session().createCriteria(DecorationRegionRankPO.class).add(Restrictions.eq("month", month)).add(Restrictions.eq("company", company)).add(Restrictions.eq(DecorationRegionRankPO.COLUMN_STATUS_STR, DecorationRegionRankPO.STATUS_TYPE_INIT_INT)).addOrder(Order.desc(DecorationRegionRankPO.COLUMN_RANK_STR));

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
