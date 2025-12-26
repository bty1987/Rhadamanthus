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

	public DecorationDesignDepartmentRightDaoImpl() {
		super(DecorationDesignDepartmentRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationDesignDepartmentRightPO> queryDecorationDesignDepartmentRight(int uid, int company) {
		return session().createCriteria(DecorationDesignDepartmentRightPO.class).add(Restrictions.eq(DecorationDesignDepartmentRightPO.COLUMN_UID_STR, uid)).add(Restrictions.eq(DecorationDesignDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int syncDecorationDesignDepartmentRight(int uid, List<Integer> companys, int company) {

		StringBuffer syncsql = new StringBuffer("insert into platform.decorationdesigndepartmentright (uid, did, company) ");

		syncsql.append("select dddr.uid, dddr.did, co.cid from platform.decorationdesigndepartmentright dddr, communion.company co where dddr.uid = :uid and dddr.company = :company and co.cid in :companys");

		session().createSQLQuery(syncsql.toString()).setInteger("uid", uid).setParameterList("companys", companys).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteDecorationDesignDepartmentRight(int uid, int company) {

		String sql = "delete from platform.decorationdesigndepartmentright where uid = :uid and company = :company";
		session().createSQLQuery(sql).setLong("uid", uid).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteDecorationDesignDepartmentRight(int uid, List<Integer> companys) {

		String sql = "delete from platform.decorationdesigndepartmentright where uid = :uid and company in :companys";
		session().createSQLQuery(sql).setLong("uid", uid).setParameterList("companys", companys).executeUpdate();

		return 0;
	}

}
