/**
 * @File Name		: ZaterialDesignerRegionCountDaoImpl.java
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
import com.fanglin.report.dao.ZaterialDesignerRegionCountDao;
import com.fanglin.report.po.ZaterialDesignerRegionCountPO;

@Repository("zaterialDesignerRegionCountDao")
public class ZaterialDesignerRegionCountDaoImpl extends DaoImpl<ZaterialDesignerRegionCountPO> implements ZaterialDesignerRegionCountDao {
	
	public ZaterialDesignerRegionCountDaoImpl(){
		super(ZaterialDesignerRegionCountPO.class);
	}
	
	@Override
	public ZaterialDesignerRegionCountPO queryZaterialDesignerRegionCountByRegionIdTime(String regionId, String time){
		return (ZaterialDesignerRegionCountPO) session().createCriteria(ZaterialDesignerRegionCountPO.class)
				.add(Restrictions.eq(ZaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR, regionId))
				.add(Restrictions.eq(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ZaterialDesignerRegionCountPO> queryZaterialDesignerRegionCount(List<FilterVO> filters){
		
		Criteria query = session().createCriteria(ZaterialDesignerRegionCountPO.class);
		
		Criterion criterion = Restrictions.ne(ZaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<ZaterialDesignerRegionCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> countZaterialDesignerRegionCount(List<FilterVO> filters) {
		
		Criteria query = session().createCriteria(ZaterialDesignerRegionCountPO.class);
		
		Criterion criterion = Restrictions.ne(ZaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR, "");
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("startTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.ge(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}else if("endTime".equals(filter.getField())){
					criterion = Restrictions.and(criterion, Restrictions.le(ZaterialDesignerRegionCountPO.COLUMN_CREATETIME_STR, filter.getData()));
				}
			}
		}else{
			return new ArrayList<Object>();
		}
		
		query.add(criterion);
		query.setProjection(Projections.projectionList()
				.add(Projections.alias(Projections.sum(ZaterialDesignerRegionCountPO.COLUMN_TOTAL_STR), ZaterialDesignerRegionCountPO.COLUMN_TOTAL_STR))
				.add(Projections.groupProperty(ZaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONID_STR))
				.add(Projections.property(ZaterialDesignerRegionCountPO.COLUMN_DESIGNERREGIONNAME_STR)));
		
		return query.list();
	}

}
