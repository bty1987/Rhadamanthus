/**
 * @File Name		: MaterialDesignerDepartmentCountDaoImpl.java
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.MaterialDesignerDepartmentCountDao;
import com.fanglin.report.po.MaterialDesignerDepartmentCountPO;

@Repository("materialDesignerDepartmentCountDao")
public class MaterialDesignerDepartmentCountDaoImpl extends DaoImpl<MaterialDesignerDepartmentCountPO> implements MaterialDesignerDepartmentCountDao {
	
	public MaterialDesignerDepartmentCountDaoImpl(){
		super(MaterialDesignerDepartmentCountPO.class);
	}
	
	@Override
	public MaterialDesignerDepartmentCountPO queryMaterialDesignerDepartmentCountByDeptIdTime(String deptId, String time){
		return (MaterialDesignerDepartmentCountPO) session().createCriteria(MaterialDesignerDepartmentCountPO.class)
				.add(Restrictions.eq(MaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR, deptId))
				.add(Restrictions.eq(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialDesignerDepartmentCountPO> queryMaterialDesignerDepartmentCount(List<FilterVO> filters) {
		Criteria query = session().createCriteria(MaterialDesignerDepartmentCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("regionId".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.eq(MaterialDesignerDepartmentCountPO.COLUMN_DESINGERREGIONID_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.eq(MaterialDesignerDepartmentCountPO.COLUMN_DESINGERREGIONID_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<MaterialDesignerDepartmentCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countMaterialDesignerDepartmentCount(List<FilterVO> filters) {
		
		Criteria query = session().createCriteria(MaterialDesignerDepartmentCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(MaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if(MaterialDesignerDepartmentCountPO.COLUMN_DESINGERREGIONID_STR.equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.eq(MaterialDesignerDepartmentCountPO.COLUMN_DESINGERREGIONID_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(MaterialDesignerDepartmentCountPO.COLUMN_TOTAL_STR), MaterialDesignerDepartmentCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(MaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR))
				.add(Projections.property(MaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTNAME_STR)));
		
		return query.list();
	}

}
