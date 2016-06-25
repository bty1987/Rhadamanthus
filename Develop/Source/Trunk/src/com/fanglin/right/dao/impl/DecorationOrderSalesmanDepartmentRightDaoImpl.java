/**
 * @File Name		: DecorationOrderSalesmanDepartmentRightDaoImpl.java
 * @Package   	: com.fanglin.right.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.DecorationOrderSalesmanDepartmentRightDao;
import com.fanglin.right.po.DecorationOrderSalesmanDepartmentRightPO;

@Repository("decorationOrderSalesmanDepartmentRightDao")
public class DecorationOrderSalesmanDepartmentRightDaoImpl extends DaoImpl<DecorationOrderSalesmanDepartmentRightPO> implements DecorationOrderSalesmanDepartmentRightDao {
	
	public DecorationOrderSalesmanDepartmentRightDaoImpl(){
		super(DecorationOrderSalesmanDepartmentRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderSalesmanDepartmentRightPO> queryDecorationOrderSalesmanDepartmentRightByUId(int uId) {
		return session().createCriteria(DecorationOrderSalesmanDepartmentRightPO.class).add(Restrictions.eq(DecorationOrderSalesmanDepartmentRightPO.COLUMN_UID_STR, uId)).list();
	}

	@Override
	public int deleteDecorationOrderSalesmanDepartmentRightByUId(int uId) {
		
		String sql = "delete from platform.decorationordersalesmandepartmentright where uId = :uId";
		session().createSQLQuery(sql).setLong("uId", uId).executeUpdate();
		
		return 0;
	}

}
