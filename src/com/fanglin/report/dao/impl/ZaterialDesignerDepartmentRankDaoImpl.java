/**
 * @File Name		: ZaterialDesignerDepartmentRankDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.ZaterialDesignerDepartmentRankDao;
import com.fanglin.report.po.ZaterialDesignerDepartmentRankPO;

@Repository("zaterialDesignerDepartmentRankDao")
public class ZaterialDesignerDepartmentRankDaoImpl extends DaoImpl<ZaterialDesignerDepartmentRankPO> implements ZaterialDesignerDepartmentRankDao {
	
	public ZaterialDesignerDepartmentRankDaoImpl(){
		super(ZaterialDesignerDepartmentRankPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ZaterialDesignerDepartmentRankPO> queryZaterialDesignerDepartmentRank() {
		return session().createCriteria(ZaterialDesignerDepartmentRankPO.class).list();
	}

	@Override
	public ZaterialDesignerDepartmentRankPO queryZaterialDesignerDepartmentRankByDeptIdInit(String deptId,int company){
		return (ZaterialDesignerDepartmentRankPO) session().createCriteria(ZaterialDesignerDepartmentRankPO.class)
				.add(Restrictions.eq(ZaterialDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, deptId))
				.add(Restrictions.eq(ZaterialDesignerDepartmentRankPO.COLUMN_COMPANY_STR, company))
				.add(Restrictions.eq(ZaterialDesignerDepartmentRankPO.COLUMN_STATUS_STR, ZaterialDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ZaterialDesignerDepartmentRankPO> queryZaterialDesignerDepartmentRankForTop(int top, int company){
		return session().createCriteria(ZaterialDesignerDepartmentRankPO.class)
				.add(Restrictions.ne(ZaterialDesignerDepartmentRankPO.COLUMN_DESIGNERDEPTID_STR, ""))
				.add(Restrictions.eq(ZaterialDesignerDepartmentRankPO.COLUMN_COMPANY_STR, company))
				.add(Restrictions.eq(ZaterialDesignerDepartmentRankPO.COLUMN_STATUS_STR, ZaterialDesignerDepartmentRankPO.STATUS_TYPE_INIT_INT))
				.addOrder(Order.desc(ZaterialDesignerDepartmentRankPO.COLUMN_RANK_STR))
				.setFirstResult(0).setMaxResults(top).list();
	}

}
