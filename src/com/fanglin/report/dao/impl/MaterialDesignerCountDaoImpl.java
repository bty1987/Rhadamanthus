/**
 * @File Name		: MaterialDesignerCountDaoImpl.java
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
import com.fanglin.report.dao.MaterialDesignerCountDao;
import com.fanglin.report.po.MaterialDesignerCountPO;

@Repository("materialDesignerCountDao")
public class MaterialDesignerCountDaoImpl extends DaoImpl<MaterialDesignerCountPO> implements MaterialDesignerCountDao {
	
	public MaterialDesignerCountDaoImpl(){
		super(MaterialDesignerCountPO.class);
	}
	
	@Override
	public MaterialDesignerCountPO queryMaterialDesignerCountByDesignerIdATime(String designerId, String time) {
		return (MaterialDesignerCountPO) session().createCriteria(MaterialDesignerCountPO.class)
				.add(Restrictions.eq(MaterialDesignerCountPO.COLUMN_DESIGNERID_STR, designerId))
				.add(Restrictions.eq(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, time))
				.setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialDesignerCountPO> queryMaterialDesignerCount(List<Filter> filters) {
		
		Criteria query = session().createCriteria(MaterialDesignerCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDesignerCountPO.COLUMN_DESIGNERID_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("departmentId".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.eq(MaterialDesignerCountPO.COLUMN_DESIGNERDEPARTMENTID_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.eq(MaterialDesignerCountPO.COLUMN_DESIGNERDEPARTMENTID_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<MaterialDesignerCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countMaterialDesignerCount(List<Filter> filters) {

		Criteria query = session().createCriteria(MaterialDesignerCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDesignerCountPO.COLUMN_DESIGNERID_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(MaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if(MaterialDesignerCountPO.COLUMN_DESIGNERDEPARTMENTID_STR.equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.eq(MaterialDesignerCountPO.COLUMN_DESIGNERDEPARTMENTID_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(MaterialDesignerCountPO.COLUMN_TOTAL_STR), MaterialDesignerCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(MaterialDesignerCountPO.COLUMN_DESIGNERID_STR))
				.add(Projections.property(MaterialDesignerCountPO.COLUMN_DESIGNERNAME_STR)));
		
		return query.list();
	}

}
