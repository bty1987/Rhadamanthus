/**
 * @File Name		: MaterialBrandCountDaoImpl.java
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
import com.fanglin.report.dao.MaterialBrandCountDao;
import com.fanglin.report.po.MaterialBrandCountPO;

@Repository("materialBrandCountDao")
public class MaterialBrandCountDaoImpl extends DaoImpl<MaterialBrandCountPO> implements MaterialBrandCountDao {
	
	public MaterialBrandCountDaoImpl(){
		super(MaterialBrandCountPO.class);
	}

	@Override
	public MaterialBrandCountPO queryMaterialBrandCountByMaterialBrandATime(String materialBrand, String time) {
		return (MaterialBrandCountPO) session().createCriteria(MaterialBrandCountPO.class)
				.add(Restrictions.eq(MaterialBrandCountPO.COLUMN_MATERIALBRAND_STR, materialBrand))
				.add(Restrictions.eq(MaterialBrandCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialBrandCountPO> queryMaterialBrandCount(List<Filter> filters) {
		
		Criteria query = session().createCriteria(MaterialBrandCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialBrandCountPO.COLUMN_MATERIALBRAND_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(MaterialBrandCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(MaterialBrandCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(MaterialBrandCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(MaterialBrandCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<MaterialBrandCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countMaterialBrandCount(List<Filter> filters) {

		Criteria query = session().createCriteria(MaterialBrandCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialBrandCountPO.COLUMN_MATERIALBRAND_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(MaterialBrandCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(MaterialBrandCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(MaterialBrandCountPO.COLUMN_TOTAL_STR), MaterialBrandCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(MaterialBrandCountPO.COLUMN_MATERIALBRAND_STR)));
		
		return query.list();
	}

}
