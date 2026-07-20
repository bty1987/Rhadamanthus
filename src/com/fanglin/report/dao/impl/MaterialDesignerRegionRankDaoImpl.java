/**
 * @File Name		: MaterialDesignerRegionRankDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
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
import com.fanglin.report.dao.MaterialDesignerRegionRankDao;
import com.fanglin.report.po.MaterialDesignerRegionRankPO;

@Repository("materialDesignerRegionRankDao")
public class MaterialDesignerRegionRankDaoImpl extends DaoImpl<MaterialDesignerRegionRankPO> implements MaterialDesignerRegionRankDao {
	
	public MaterialDesignerRegionRankDaoImpl(){
		super(MaterialDesignerRegionRankPO.class);
	}
	
	@Override
	public MaterialDesignerRegionRankPO queryMaterialDesignerRegionRankByRegionIdInit(String regionId,int company){
		return (MaterialDesignerRegionRankPO) session().createCriteria(MaterialDesignerRegionRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq(MaterialDesignerRegionRankPO.COLUMN_DESIGNERREGIONID_STR, regionId))
				.add(Restrictions.eq(MaterialDesignerRegionRankPO.COLUMN_STATUS_STR, MaterialDesignerRegionRankPO.STATUS_TYPE_INIT_INT))
				.setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialDesignerRegionRankPO> queryMaterialDesignerRegionRankForTop(int top,int company){
		
		Criteria criteria = session().createCriteria(MaterialDesignerRegionRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.ne(MaterialDesignerRegionRankPO.COLUMN_DESIGNERREGIONID_STR, ""))
				.add(Restrictions.eq(MaterialDesignerRegionRankPO.COLUMN_STATUS_STR, MaterialDesignerRegionRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(MaterialDesignerRegionRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}

}
