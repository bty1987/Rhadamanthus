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
import com.fanglin.report.dao.DecorationDesignerRegionRankDao;
import com.fanglin.report.po.DecorationDesignerRegionRankPO;

@Repository("decorationDesignerRegionRankDao")
public class DecorationDesignerRegionRankDaoImpl extends DaoImpl<DecorationDesignerRegionRankPO> implements DecorationDesignerRegionRankDao {
	
	public DecorationDesignerRegionRankDaoImpl(){
		super(DecorationDesignerRegionRankPO.class);
	}

	@Override
	public DecorationDesignerRegionRankPO queryDecorationDesignerRegionRankForInitByRegionId(String regionId) {
		return (DecorationDesignerRegionRankPO) session().createCriteria(DecorationDesignerRegionRankPO.class)
				.add(Restrictions.eq(DecorationDesignerRegionRankPO.COLUMN_DESIGNERREGIONID_STR, regionId))
				.add(Restrictions.eq(DecorationDesignerRegionRankPO.COLUMN_STATUS_STR, DecorationDesignerRegionRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationDesignerRegionRankPO> queryDecorationDesignerRegionRankForTop(int top) {
		
		Criteria criteria = session().createCriteria(DecorationDesignerRegionRankPO.class)
				.add(Restrictions.ne(DecorationDesignerRegionRankPO.COLUMN_DESIGNERREGIONID_STR, ""))
				.add(Restrictions.eq(DecorationDesignerRegionRankPO.COLUMN_STATUS_STR, DecorationDesignerRegionRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(DecorationDesignerRegionRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}

}
