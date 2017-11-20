/**
 * @File Name		: DecorationDesignerRankDaoImpl.java
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
import com.fanglin.report.dao.DecorationDesignerRankDao;
import com.fanglin.report.po.DecorationDesignerRankPO;

@Repository("decorationDesignerRankDao")
public class DecorationDesignerRankDaoImpl extends DaoImpl<DecorationDesignerRankPO> implements DecorationDesignerRankDao {
	
	public DecorationDesignerRankDaoImpl(){
		super(DecorationDesignerRankPO.class);
	}

	@Override
	public DecorationDesignerRankPO queryDecorationDesignerRankForInitByDesignerId(String designerId,int company) {
		return (DecorationDesignerRankPO) session().createCriteria(DecorationDesignerRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq(DecorationDesignerRankPO.COLUMN_DESIGNERID_STR, designerId))
				.add(Restrictions.eq(DecorationDesignerRankPO.COLUMN_STATUS_STR, DecorationDesignerRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationDesignerRankPO> queryDecorationDesignerRankForTop(int top,int company) {
		
		Criteria criteria = session().createCriteria(DecorationDesignerRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.ne(DecorationDesignerRankPO.COLUMN_DESIGNERID_STR, ""))
				.add(Restrictions.eq(DecorationDesignerRankPO.COLUMN_STATUS_STR, DecorationDesignerRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(DecorationDesignerRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
				
	}

	@Override
	public List<?> queryDecorationDesignerRankForPlaceByDesignerId(String designerId,int company) {
		
		int status = DecorationDesignerRankPO.STATUS_TYPE_INIT_INT;
		
		String sql = "select b.rank, (select count(1)+1 from report.decorationdesignerrank a where a.status =:statusA and b.status =:statusB and a.rank > b.rank and a.company =:companyA and b.company =:companyB) place from report.decorationdesignerrank b where b.status =:statusC and b.designerId =:designerId and b.company =:companyC";
		
		return session().createSQLQuery(sql).setInteger("statusA", status).setInteger("statusB", status).setInteger("statusC", status).setInteger("companyA", company).setInteger("companyB", company).setInteger("companyC", company).setString("designerId", designerId).list();
	}

}
