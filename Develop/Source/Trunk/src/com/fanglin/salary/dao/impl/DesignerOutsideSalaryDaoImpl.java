/**
 * @File Name		: DesignerOutsideSalaryDao.java
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
import com.fanglin.salary.dao.DesignerOutsideSalaryDao;
import com.fanglin.salary.po.DesignerOutsideSalaryPO;
import com.fanglin.utils.Paging;

@Repository("designerOutsideSalaryDao")
public class DesignerOutsideSalaryDaoImpl extends DaoImpl<DesignerOutsideSalaryPO> implements DesignerOutsideSalaryDao {
	
	public DesignerOutsideSalaryDaoImpl(){
		super(DesignerOutsideSalaryPO.class);
	}
	
	@Override
	public List<DesignerOutsideSalaryPO> pageDesignerOutsideSalary(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<DesignerOutsideSalaryPO> query = pagingQuery(paging, DesignerOutsideSalaryPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(DesignerOutsideSalaryPO.COLUMN_STATUS_STR.equals(filter.getField())){
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
	public List<DesignerOutsideSalaryPO> queryDesignerOutsideSalary(List<FilterVO> filters) {
		
		Criteria query = session().createCriteria(DesignerOutsideSalaryPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(Restrictions.eq(filter.getField(), filter.getData()));
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DesignerOutsideSalaryPO> queryDesignerOutsideSalaryByDsId(int dsId) {
		return session().createCriteria(DesignerOutsideSalaryPO.class).add(Restrictions.eq(DesignerOutsideSalaryPO.COLUMN_DSID_STR, dsId)).list();
	}

}
