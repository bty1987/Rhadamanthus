package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.ZaterialDesignerRegionRankDao;
import com.fanglin.report.po.ZaterialDesignerRegionRankPO;

@Repository("zaterialDesignerRegionRankDao")
public class ZaterialDesignerRegionRankDaoImpl extends DaoImpl<ZaterialDesignerRegionRankPO> implements ZaterialDesignerRegionRankDao {
	
	public ZaterialDesignerRegionRankDaoImpl(){
		super(ZaterialDesignerRegionRankPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ZaterialDesignerRegionRankPO> queryZaterialDesignerRegionRank() {
		return session().createCriteria(ZaterialDesignerRegionRankPO.class).list();
	}

	@Override
	public ZaterialDesignerRegionRankPO queryZaterialDesignerRegionRankByRegionIdInit(String regionId,int company){
		return (ZaterialDesignerRegionRankPO) session().createCriteria(ZaterialDesignerRegionRankPO.class)
				.add(Restrictions.eq(ZaterialDesignerRegionRankPO.COLUMN_DESIGNERREGIONID_STR, regionId))
				.add(Restrictions.eq(ZaterialDesignerRegionRankPO.COLUMN_COMPANY_STR, company))
				.add(Restrictions.eq(ZaterialDesignerRegionRankPO.COLUMN_STATUS_STR, ZaterialDesignerRegionRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ZaterialDesignerRegionRankPO> queryZaterialDesignerRegionRankForTop(int top,int company){
		return session().createCriteria(ZaterialDesignerRegionRankPO.class)
				.add(Restrictions.ne(ZaterialDesignerRegionRankPO.COLUMN_DESIGNERREGIONID_STR, ""))
				.add(Restrictions.eq(ZaterialDesignerRegionRankPO.COLUMN_COMPANY_STR, company))
				.add(Restrictions.eq(ZaterialDesignerRegionRankPO.COLUMN_STATUS_STR, ZaterialDesignerRegionRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(ZaterialDesignerRegionRankPO.COLUMN_RANK_STR))
				.setFirstResult(0).setMaxResults(top).list();
	}

}
