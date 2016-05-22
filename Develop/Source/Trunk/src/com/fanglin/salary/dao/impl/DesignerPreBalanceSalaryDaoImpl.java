/**
 * @File Name		: DesignerPreBalanceSalaryDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.DesignerPreBalanceSalaryDao;
import com.fanglin.salary.po.DesignerPreBalanceSalaryPO;
import com.fanglin.utils.Paging;

@Repository("designerPreBalanceSalaryDao")
public class DesignerPreBalanceSalaryDaoImpl extends DaoImpl<DesignerPreBalanceSalaryPO> implements DesignerPreBalanceSalaryDao {
	
	public DesignerPreBalanceSalaryDaoImpl(){
		super(DesignerPreBalanceSalaryPO.class);
	}
	
	@Override
	public List<DesignerPreBalanceSalaryPO> pageDesignerPreBalanceSalary(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<DesignerPreBalanceSalaryPO> query = pagingQuery(paging, DesignerPreBalanceSalaryPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public List<DesignerPreBalanceSalaryPO> pageDesignerPreBalanceSalaryByMsoId(Paging paging, List<FilterVO> filters, long msoId) {
		
		PagingQuery<DesignerPreBalanceSalaryPO> query = pagingQuery(paging, DesignerPreBalanceSalaryPO.class);
		
		query.add(query.getCriterion(DesignerPreBalanceSalaryPO.COLUMN_MSOID_STR, msoId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DesignerPreBalanceSalaryPO> queryDesignerPreBalanceSalaryByDsId(int dsId) {
		return session().createCriteria(DesignerPreBalanceSalaryPO.class)
				.add(Restrictions.eq(DesignerPreBalanceSalaryPO.COLUMN_DSID_STR, dsId))
				.list();
	}

}
