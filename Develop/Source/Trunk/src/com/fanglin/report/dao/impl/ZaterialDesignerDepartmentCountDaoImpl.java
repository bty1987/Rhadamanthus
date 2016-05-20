/**
 * @File Name		: ZaterialDesignerDepartmentCountDaoImpl.java
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
import com.fanglin.report.dao.ZaterialDesignerDepartmentCountDao;
import com.fanglin.report.po.ZaterialDesignerDepartmentCountPO;

@Repository("zaterialDesignerDepartmentCountDao")
public class ZaterialDesignerDepartmentCountDaoImpl extends DaoImpl<ZaterialDesignerDepartmentCountPO> implements ZaterialDesignerDepartmentCountDao {
	
	public ZaterialDesignerDepartmentCountDaoImpl(){
		super(ZaterialDesignerDepartmentCountPO.class);
	}
	
	@Override
	public ZaterialDesignerDepartmentCountPO queryZaterialDesignerDepartmentCountByDeptIdTime(String deptId, String time){
		return (ZaterialDesignerDepartmentCountPO) session().createCriteria(ZaterialDesignerDepartmentCountPO.class)
				.add(Restrictions.eq(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR, deptId))
				.add(Restrictions.eq(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ZaterialDesignerDepartmentCountPO> queryZaterialDesignerDepartmentCount(List<FilterVO> filters){
		Criteria query = session().createCriteria(ZaterialDesignerDepartmentCountPO.class);
		
		Criterion criterion = Restrictions.ne(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("regionId".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.eq(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERREGIONID_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.eq(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERREGIONID_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<ZaterialDesignerDepartmentCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countZaterialDesignerDepartmentCount(List<FilterVO> filters) {
		
		Criteria query = session().createCriteria(ZaterialDesignerDepartmentCountPO.class);
		
		Criterion criterion = Restrictions.ne(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(ZaterialDesignerDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERREGIONID_STR.equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.eq(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERREGIONID_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(ZaterialDesignerDepartmentCountPO.COLUMN_TOTAL_STR), ZaterialDesignerDepartmentCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTID_STR))
				.add(Projections.property(ZaterialDesignerDepartmentCountPO.COLUMN_DESIGNERDEPTNAME_STR)));
		
		return query.list();
	}

}
