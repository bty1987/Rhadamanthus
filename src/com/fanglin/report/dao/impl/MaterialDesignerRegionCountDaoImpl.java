/**
 * @File Name		: MaterialDesignerRegionCountDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.MaterialDesignerRegionCountDao;
import com.fanglin.report.po.MaterialDesignerRegionCountPO;

@Repository("materialDesignerRegionCountDao")
public class MaterialDesignerRegionCountDaoImpl extends DaoImpl<MaterialDesignerRegionCountPO> implements MaterialDesignerRegionCountDao {
	
	public MaterialDesignerRegionCountDaoImpl(){
		super(MaterialDesignerRegionCountPO.class);
	}
	
	@Override
	public MaterialDesignerRegionCountPO queryMaterialDesignerRegionCountByRegionIdTime(String regionId, String time){
		return (MaterialDesignerRegionCountPO) session().createCriteria(MaterialDesignerRegionCountPO.class)
				.add(Restrictions.eq(MaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR, regionId))
				.add(Restrictions.eq(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, time))
				.setMaxResults(1).uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MaterialDesignerRegionCountPO> queryMaterialDesignerRegionCount(List<Filter> filters){
		
		Criteria query = session().createCriteria(MaterialDesignerRegionCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<MaterialDesignerRegionCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countMaterialDesignerRegionCount(List<Filter> filters) {
		
		Criteria query = session().createCriteria(MaterialDesignerRegionCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(MaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(MaterialDesignerRegionCountPO.COLUMN_TOTAL_STR), MaterialDesignerRegionCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(MaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR))
				.add(Projections.property(MaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONNAME_STR)));
		
		return query.list();
	}

}
