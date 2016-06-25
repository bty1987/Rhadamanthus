/**
 * @File Name		: DesignerSalaryDaoImpl.java
 * @Package   	: com.fanglin.dao.salary
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
import com.fanglin.salary.dao.DesignerSalaryDao;
import com.fanglin.salary.po.DesignerSalaryPO;
import com.fanglin.utils.Paging;

@Repository("designerSalaryDao")
public class DesignerSalaryDaoImpl extends DaoImpl<DesignerSalaryPO> implements DesignerSalaryDao {
	
	public DesignerSalaryDaoImpl(){
		super(DesignerSalaryPO.class);
	}

	@Override
	public List<DesignerSalaryPO> pageDesignerSalary(Paging paging, List<FilterVO> filters, Integer status) {
		
		PagingQuery<DesignerSalaryPO> query = pagingQuery(paging, DesignerSalaryPO.class);
		
		query.add(query.getCriterion(DesignerSalaryPO.COLUMN_USERID_STR, "", "ne"));
		
		if(status != null){
			query.add(query.getCriterion(DesignerSalaryPO.COLUMN_STATUS_STR, status, "eq"));
		}
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public DesignerSalaryPO queryDesignerSalaryByUserIdInit(String userId) {
		
		return (DesignerSalaryPO) session().createCriteria(DesignerSalaryPO.class)
				.add(Restrictions.eq(DesignerSalaryPO.COLUMN_USERID_STR, userId))
				.add(Restrictions.eq(DesignerSalaryPO.COLUMN_STATUS_STR, DesignerSalaryPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DesignerSalaryPO> queryDesignerSalaryByUserId(String userId) {
		return session().createCriteria(DesignerSalaryPO.class)
				.add(Restrictions.eq(DesignerSalaryPO.COLUMN_USERID_STR, userId))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DesignerSalaryPO> queryDesignerSalaryByInit() {
		return session().createCriteria(DesignerSalaryPO.class)
				.add(Restrictions.ne(DesignerSalaryPO.COLUMN_USERID_STR, ""))
				.add(Restrictions.eq(DesignerSalaryPO.COLUMN_STATUS_STR, DesignerSalaryPO.STATUS_TYPE_INIT_INT))
				.list();
	}

	@Override
	public DesignerSalaryPO queryDesignerSalaryByDsId(int dsId) {
		return (DesignerSalaryPO) session().createCriteria(DesignerSalaryPO.class).add(Restrictions.eq(DesignerSalaryPO.COLUMN_DSID_STR, dsId)).uniqueResult();
	}

}
