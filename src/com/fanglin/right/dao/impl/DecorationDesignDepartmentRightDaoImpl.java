/**
 * @File Name		: DecorationDesignDepartmentRightDaoImpl.java
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
import com.fanglin.right.dao.DecorationDesignDepartmentRightDao;
import com.fanglin.right.po.DecorationDesignDepartmentRightPO;

@Repository("decorationDesignDepartmentRightDao")
public class DecorationDesignDepartmentRightDaoImpl extends DaoImpl<DecorationDesignDepartmentRightPO> implements DecorationDesignDepartmentRightDao {
	
	public DecorationDesignDepartmentRightDaoImpl(){
		super(DecorationDesignDepartmentRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationDesignDepartmentRightPO> queryDecorationDesignDepartmentRightByUId(int uId, int company) {
		return session().createCriteria(DecorationDesignDepartmentRightPO.class).add(Restrictions.eq(DecorationDesignDepartmentRightPO.COLUMN_UID_STR, uId)).add(Restrictions.eq(DecorationDesignDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int deleteDecorationDesignDepartmentRightByUId(int uId, int company) {
		
		String sql = "delete from platform.decorationdesigndepartmentright where uId = :uId and company = :company";
		session().createSQLQuery(sql).setLong("uId", uId).setInteger("company", company).executeUpdate();
		
		return 0;
	}
	
}
