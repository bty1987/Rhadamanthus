/**
 * @File Name		: ZaterialDesignerCountDaoImpl.java
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.ZaterialDesignerCountDao;
import com.fanglin.report.po.ZaterialDesignerCountPO;

@Repository("zaterialDesignerCountDao")
public class ZaterialDesignerCountDaoImpl extends DaoImpl<ZaterialDesignerCountPO> implements ZaterialDesignerCountDao {

	public ZaterialDesignerCountDaoImpl(){
		super(ZaterialDesignerCountPO.class);
	}
	
	@Override
	public ZaterialDesignerCountPO queryZaterialDesignerCountByDesignerIdATime(String designerId, String time) {
		return (ZaterialDesignerCountPO) session().createCriteria(ZaterialDesignerCountPO.class)
				.add(Restrictions.eq(ZaterialDesignerCountPO.COLUMN_DESIGNERID_STR, designerId))
				.add(Restrictions.eq(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ZaterialDesignerCountPO> queryZaterialDesignerCount(List<FilterVO> filters) {
		
		Criteria query = session().createCriteria(ZaterialDesignerCountPO.class);
		
		Criterion criterion = Restrictions.ne(ZaterialDesignerCountPO.COLUMN_DESIGNERID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("departmentId".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.eq(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.eq(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<ZaterialDesignerCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countZaterialDesignerCount(List<FilterVO> filters) {

		Criteria query = session().createCriteria(ZaterialDesignerCountPO.class);
		
		Criterion criterion = Restrictions.ne(ZaterialDesignerCountPO.COLUMN_DESIGNERID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(ZaterialDesignerCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if(ZaterialDesignerCountPO.COLUMN_DESIGNERDEPARTMENTID_STR.equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.eq(ZaterialDesignerCountPO.COLUMN_DESIGNERDEPARTMENTID_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(ZaterialDesignerCountPO.COLUMN_TOTAL_STR), ZaterialDesignerCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(ZaterialDesignerCountPO.COLUMN_DESIGNERID_STR))
				.add(Projections.property(ZaterialDesignerCountPO.COLUMN_DESIGNERNAME_STR)));
		
		return query.list();
	}

}
