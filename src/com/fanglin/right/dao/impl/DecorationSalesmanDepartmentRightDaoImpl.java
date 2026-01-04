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

	public DecorationSalesmanDepartmentRightDaoImpl() {
		super(DecorationSalesmanDepartmentRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationSalesmanDepartmentRightPO> queryDecorationSalesmanDepartmentRight(int uId, int company) {
		return session().createCriteria(DecorationSalesmanDepartmentRightPO.class).add(Restrictions.eq(DecorationSalesmanDepartmentRightPO.COLUMN_UID_STR, uId)).add(Restrictions.eq(DecorationSalesmanDepartmentRightPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public int syncDecorationSalesmanDepartmentRight(int uid, List<Integer> companys, int company) {

		StringBuffer syncsql = new StringBuffer("insert into platform.decorationsalesmandepartmentright (uid, did, company) ");

		syncsql.append("select dsdr.uid, dsdr.did, co.cid from platform.decorationsalesmandepartmentright dsdr, communion.company co where dsdr.uid = :uid and dsdr.company = :company and co.cid in :companys");

		session().createSQLQuery(syncsql.toString()).setInteger("uid", uid).setParameterList("companys", companys).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteDecorationSalesmanDepartmentRight(int uid, int company) {

		String sql = "delete from platform.decorationsalesmandepartmentright where uid = :uid and company = :company";
		session().createSQLQuery(sql).setLong("uid", uid).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteDecorationSalesmanDepartmentRight(int uid, List<Integer> companys) {

		String sql = "delete from platform.decorationsalesmandepartmentright where uid = :uid and company in :companys";
		session().createSQLQuery(sql).setLong("uid", uid).setParameterList("companys", companys).executeUpdate();

		return 0;
	}

}
