/**
 * @File Name		: DecorationOrderDesignDepartmentRightDaoImpl.java
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
import com.fanglin.right.dao.DecorationOrderDesignDepartmentRightDao;
import com.fanglin.right.po.DecorationOrderDesignDepartmentRightPO;

@Repository("decorationOrderDesignDepartmentRightDao")
public class DecorationOrderDesignDepartmentRightDaoImpl extends DaoImpl<DecorationOrderDesignDepartmentRightPO> implements DecorationOrderDesignDepartmentRightDao {
	
	public DecorationOrderDesignDepartmentRightDaoImpl(){
		super(DecorationOrderDesignDepartmentRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderDesignDepartmentRightPO> queryDecorationOrderDesignDepartmentRightByUId(int uId, int company) {
		return session().createCriteria(DecorationOrderDesignDepartmentRightPO.class).add(Restrictions.eq(DecorationOrderDesignDepartmentRightPO.COLUMN_UID_STR, uId)).add(Restrictions.eq(DecorationOrderDesignDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int deleteDecorationOrderDesignDepartmentRightByUId(int uId, int company) {
		
		String sql = "delete from platform.decorationorderdesigndepartmentright where uId = :uId and company = :company";
		session().createSQLQuery(sql).setLong("uId", uId).setInteger("company", company).executeUpdate();
		
		return 0;
	}
	
}
