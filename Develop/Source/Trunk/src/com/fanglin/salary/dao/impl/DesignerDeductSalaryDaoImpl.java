/**
 * @File Name		: DesignerDeductSalaryDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-11-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.DesignerDeductSalaryDao;
import com.fanglin.salary.po.DesignerDeductSalaryPO;
import com.fanglin.utils.Paging;

@Repository("designerDeductSalaryDao")
public class DesignerDeductSalaryDaoImpl extends DaoImpl<DesignerDeductSalaryPO> implements DesignerDeductSalaryDao {
	
	public DesignerDeductSalaryDaoImpl(){
		super(DesignerDeductSalaryPO.class);
	}

	@Override
	public List<DesignerDeductSalaryPO> pageDesignerDeductSalary(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<DesignerDeductSalaryPO> query = pagingQuery(paging, DesignerDeductSalaryPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(DesignerDeductSalaryPO.COLUMN_STATUS_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}else if(DesignerDeductSalaryPO.COLUMN_TYPE_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter));
				}
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DesignerDeductSalaryPO> queryDesignerDeductSalary(List<FilterVO> filters) {
		
		Criteria query = session().createCriteria(DesignerDeductSalaryPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(Restrictions.eq(filter.getField(), filter.getData()));
			}
		}
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<DesignerDeductSalaryPO> queryDesignerDeductSalaryByDsId(int dsId) {
		return session().createCriteria(DesignerDeductSalaryPO.class).add(Restrictions.eq(DesignerDeductSalaryPO.COLUMN_DSID_STR, dsId)).list();
	}

}
