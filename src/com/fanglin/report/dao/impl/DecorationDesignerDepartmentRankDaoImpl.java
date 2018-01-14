/**
 * @File Name		: DecorationDesignerDepartmentRankDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.DecorationDesignerDepartmentRankDao;
import com.fanglin.report.po.DecorationDesignerDepartmentRankPO;

@Repository("decorationDesignerDepartmentRankDao")
public class DecorationDesignerDepartmentRankDaoImpl extends DaoImpl<DecorationDesignerDepartmentRankPO> implements DecorationDesignerDepartmentRankDao {
	
	public DecorationDesignerDepartmentRankDaoImpl(){
		super(DecorationDesignerDepartmentRankPO.class);
	}

	@Override
	public DecorationDesignerDepartmentRankPO queryDecorationDesignerDepartmentRankForInitByDeptId(String deptId,int company) {
		
		return (DecorationDesignerDepartmentRankPO) session().createCriteria(DecorationDesignerDepartmentRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq(DecorationDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, deptId))
				.add(Restrictions.eq(DecorationDesignerDepartmentRankPO.COLUMN_STATUS_STR, DecorationDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationDesignerDepartmentRankPO> queryDecorationDesignerDepartmentRankForTop(int top,int company) {
		
		Criteria criteria = session().createCriteria(DecorationDesignerDepartmentRankPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.ne(DecorationDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, ""))
				.add(Restrictions.eq(DecorationDesignerDepartmentRankPO.COLUMN_STATUS_STR, DecorationDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(DecorationDesignerDepartmentRankPO.COLUMN_RANK_STR));
		
		if(top >= 0){	
			criteria.setFirstResult(0).setMaxResults(top);
		}
		
		return criteria.list();
	}

}
