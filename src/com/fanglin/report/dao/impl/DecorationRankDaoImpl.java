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
import com.fanglin.report.dao.DecorationRankDao;
import com.fanglin.report.po.DecorationRankPO;

@Repository("decorationRankDao")
public class DecorationRankDaoImpl extends DaoImpl<DecorationRankPO> implements DecorationRankDao {

	public DecorationRankDaoImpl() {
		super(DecorationRankPO.class);
	}

	@Override
	public DecorationRankPO queryDecorationRankForInitByDesignerId(String designerId, int company) {
		return (DecorationRankPO) session().createCriteria(DecorationRankPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(DecorationRankPO.COLUMN_STATUS_STR, DecorationRankPO.STATUS_TYPE_INIT_INT)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationRankPO> queryDecorationRankForTop(int top, int month, Integer duid, Integer ddid, Integer drid, Short type, int company) {

		Criteria criteria = session().createCriteria(DecorationRankPO.class).add(Restrictions.eq("month", month)).add(Restrictions.eq("company", company)).add(Restrictions.eq(DecorationRankPO.COLUMN_STATUS_STR, DecorationRankPO.STATUS_TYPE_INIT_INT)).addOrder(Order.desc(DecorationRankPO.COLUMN_RANK_STR));

		if (duid != null) {
			criteria.createAlias("designer", "designer").add(Restrictions.eq("designer.uid", duid));
		}

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

	@Override
	public List<?> queryDecorationRankForPlaceByDesignerId(String designerId, int company) {

		int status = DecorationRankPO.STATUS_TYPE_INIT_INT;

		String sql = "select b.rank, (select count(1)+1 from report.decorationrank a where a.status =:statusA and b.status =:statusB and a.rank > b.rank and a.company =:companyA and b.company =:companyB) place from report.decorationrank b where b.status =:statusC and b.designerId =:designerId and b.company =:companyC";

		return session().createSQLQuery(sql).setInteger("statusA", status).setInteger("statusB", status).setInteger("statusC", status).setInteger("companyA", company).setInteger("companyB", company).setInteger("companyC", company).setString("designerId", designerId).list();
	}

}
