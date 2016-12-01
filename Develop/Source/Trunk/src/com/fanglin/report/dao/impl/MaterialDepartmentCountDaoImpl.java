/**
 * @File Name		: MaterialDepartmentCountDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-14
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
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.MaterialDepartmentCountDao;
import com.fanglin.report.po.MaterialDepartmentCountPO;

@Repository("materialDepartmentCountDao")
public class MaterialDepartmentCountDaoImpl extends DaoImpl<MaterialDepartmentCountPO> implements MaterialDepartmentCountDao {

	public MaterialDepartmentCountDaoImpl(){
		super(MaterialDepartmentCountPO.class);
	}

	@Override
	public MaterialDepartmentCountPO queryMaterialDepartmentCountByDeptIdTime(String deptId, String time){
		return (MaterialDepartmentCountPO) session().createCriteria(MaterialDepartmentCountPO.class)
				.add(Restrictions.eq(MaterialDepartmentCountPO.COLUMN_MATERIALDEPTID_STR, deptId))
				.add(Restrictions.eq(MaterialDepartmentCountPO.COLUMN_CREATETIME_STR, time))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialDepartmentCountPO> queryMaterialDepartmentCount(List<Filter> filters){
		
		Criteria query = session().createCriteria(MaterialDepartmentCountPO.class);
		
		Criterion criterion = Restrictions.ne(MaterialDepartmentCountPO.COLUMN_MATERIALDEPTID_STR, "");
		
		if(filters != null){
			for(Filter filter: filters){
				if("startTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.ge(MaterialDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.ge(MaterialDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}else if("endTime".equals(filter.getField())){
					if(criterion == null){
						criterion = Restrictions.le(MaterialDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData());
					}else{
						criterion = Restrictions.and(criterion, Restrictions.le(MaterialDepartmentCountPO.COLUMN_CREATETIME_STR, filter.getData()));
					}
				}
			}
		}else{
			return new ArrayList<MaterialDepartmentCountPO>();
		}
		
		if(criterion != null){
			query.add(criterion);
		}
		
		return query.list();
	}

}
