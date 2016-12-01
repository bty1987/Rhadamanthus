/**
 * @File Name		: MaterialTypeCountDaoImpl.java
 * @Package   	: com.fanglin.material.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-5-24
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
import com.fanglin.report.dao.MaterialTypeCountDao;
import com.fanglin.report.po.MaterialTypeCountPO;

@Repository("materialTypeCountDao")
public class MaterialTypeCountDaoImpl extends DaoImpl<MaterialTypeCountPO> implements MaterialTypeCountDao {

	public MaterialTypeCountDaoImpl(){
		super(MaterialTypeCountPO.class);
	}

	@Override
	public MaterialTypeCountPO queryMaterialTypeCountByMaterialTypeATime(String materialType, String time) {
		return (MaterialTypeCountPO) session().createCriteria(MaterialTypeCountPO.class)
				.add(Restrictions.eq(MaterialTypeCountPO.COLUMN_MATERIALTYPE_STR, materialType))
				.add(Restrictions.eq(MaterialTypeCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialTypeCountPO> queryMaterialTypeCount(List<Filter> filters) {
		
		Criteria query = session().createCriteria(MaterialTypeCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialTypeCountPO.COLUMN_MATERIALTYPE_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(MaterialTypeCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(MaterialTypeCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(MaterialTypeCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(MaterialTypeCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<MaterialTypeCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countMaterialTypeCount(List<Filter> filters) {

		Criteria query = session().createCriteria(MaterialTypeCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialTypeCountPO.COLUMN_MATERIALTYPE_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(MaterialTypeCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(MaterialTypeCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(MaterialTypeCountPO.COLUMN_TOTAL_STR), MaterialTypeCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(MaterialTypeCountPO.COLUMN_MATERIALTYPE_STR)));
		
		return query.list();
	}

}
