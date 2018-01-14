/**
 * @File Name		: DecorationSalesmanDepartmentRightDaoImpl.java
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
import com.fanglin.right.dao.DecorationSalesmanDepartmentRightDao;
import com.fanglin.right.po.DecorationSalesmanDepartmentRightPO;

@Repository("decorationSalesmanDepartmentRightDao")
public class DecorationSalesmanDepartmentRightDaoImpl extends DaoImpl<DecorationSalesmanDepartmentRightPO> implements DecorationSalesmanDepartmentRightDao {
	
	public DecorationSalesmanDepartmentRightDaoImpl(){
		super(DecorationSalesmanDepartmentRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationSalesmanDepartmentRightPO> queryDecorationSalesmanDepartmentRightByUId(int uId, int company) {
		return session().createCriteria(DecorationSalesmanDepartmentRightPO.class).add(Restrictions.eq(DecorationSalesmanDepartmentRightPO.COLUMN_UID_STR, uId)).add(Restrictions.eq(DecorationSalesmanDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int deleteDecorationSalesmanDepartmentRightByUId(int uId, int company) {
		
		String sql = "delete from platform.decorationsalesmandepartmentright where uId = :uId and company = :company";
		session().createSQLQuery(sql).setLong("uId", uId).setInteger("company", company).executeUpdate();
		
		return 0;
	}

}
