/**
 * @File Name		: DesignerPostBalanceSalaryDaoImpl.java
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
import com.fanglin.salary.dao.DesignerPostBalanceSalaryDao;
import com.fanglin.salary.po.DesignerPostBalanceSalaryPO;
import com.fanglin.utils.Paging;

@Repository("designerPostBalanceSalaryDao")
public class DesignerPostBalanceSalaryDaoImpl extends DaoImpl<DesignerPostBalanceSalaryPO> implements DesignerPostBalanceSalaryDao {
	
	public DesignerPostBalanceSalaryDaoImpl(){
		super(DesignerPostBalanceSalaryPO.class);
	}
	
	@Override
	public List<DesignerPostBalanceSalaryPO> pageDesignerPostBalanceSalary(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<DesignerPostBalanceSalaryPO> query = pagingQuery(paging, DesignerPostBalanceSalaryPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public List<DesignerPostBalanceSalaryPO> pageDesignerPostBalanceSalaryByMsoId(Paging paging, List<FilterVO> filters, long msoId) {
		
		PagingQuery<DesignerPostBalanceSalaryPO> query = pagingQuery(paging, DesignerPostBalanceSalaryPO.class);
		
		query.add(query.getCriterion(DesignerPostBalanceSalaryPO.COLUMN_MSOID_STR, msoId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DesignerPostBalanceSalaryPO> queryDesignerPostBalanceSalaryByDsId(int dsId) {
		return session().createCriteria(DesignerPostBalanceSalaryPO.class)
				.add(Restrictions.eq(DesignerPostBalanceSalaryPO.COLUMN_DSID_STR, dsId))
				.add(Restrictions.eq(DesignerPostBalanceSalaryPO.COLUMN_STATUS_STR, DesignerPostBalanceSalaryPO.STATUS_TYPE_PAYOFF_INT))
				.list();
	}

}
