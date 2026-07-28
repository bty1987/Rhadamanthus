package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.CustomerFunctionRightDao;
import com.fanglin.right.po.CustomerFunctionRightPO;

@Repository("customerFunctionRightDao")
public class CustomerFunctionRightDaoImpl extends DaoImpl<CustomerFunctionRightPO> implements CustomerFunctionRightDao {
	
	public CustomerFunctionRightDaoImpl(){
		super(CustomerFunctionRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerFunctionRightPO> queryCustomerFunctionRight(String name, Integer company) {
		return session().createCriteria(CustomerFunctionRightPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public void syncCustomerFunctionRight(String name, List<Integer> cids, Integer company) {

		StringBuffer syncsql = new StringBuffer("insert into platform.customerfunctionright (name, cfid, company) ");

		syncsql.append("select cfr.name, cfr.cfid, co.cid from platform.customerfunctionright cfr, communion.company co where cfr.name = :name and cfr.company = :company and co.cid in :companys");

		session().createSQLQuery(syncsql.toString()).setString("name", name).setInteger("company", company).setParameterList("companys", cids).setInteger("company", company).executeUpdate();
	}

	@Override
	public int deleteCustomerFunctionRightByName(String name, Integer company) {

		String sql = "delete from platform.customerfunctionright where name = :name and company = :company";
		session().createSQLQuery(sql).setString("name", name).setInteger("company", company).executeUpdate();

		return 0;
	}

	@Override
	public int deleteCustomerFunctionRight(String name, List<Integer> cids) {

		String sql = "delete from platform.customerfunctionright where name = :name and company in :companys";
		session().createSQLQuery(sql).setString("name", name).setParameterList("companys", cids).executeUpdate();

		return 0;
	}

}
