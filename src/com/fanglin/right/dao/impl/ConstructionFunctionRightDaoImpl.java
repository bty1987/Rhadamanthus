package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.ConstructionFunctionRightDao;
import com.fanglin.right.po.ConstructionFunctionRightPO;

@Repository("constructionFunctionRightDao")
public class ConstructionFunctionRightDaoImpl extends DaoImpl<ConstructionFunctionRightPO> implements ConstructionFunctionRightDao {

	public ConstructionFunctionRightDaoImpl() {
		super(ConstructionFunctionRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionFunctionRightPO> queryConstructionFunctionRightByName(String name, Integer company) {
		return session().createCriteria(ConstructionFunctionRightPO.class).add(Restrictions.eq("name", name)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public void syncConstructionFunctionRight(String name, List<Integer> cids, Integer company) {

		StringBuffer syncsql = new StringBuffer("insert into platform.constructionfunctionright (name, cfid, company) ");

		syncsql.append("select cfr.name, cfr.cfid, co.cid from platform.constructionfunctionright cfr, communion.company co where cfr.name = :name and cfr.company = :company and co.cid in :companys");

		session().createSQLQuery(syncsql.toString()).setString("name", name).setInteger("company", company).setParameterList("companys", cids).setInteger("company", company).executeUpdate();

	}

	@Override
	public void deleteConstructionFunctionRight(String name, List<Integer> cids) {

		String sql = "delete from platform.constructionfunctionright where name = :name and company in :companys";
		session().createSQLQuery(sql).setString("name", name).setParameterList("companys", cids).executeUpdate();
	}

	@Override
	public int deleteConstructionFunctionRightByName(String name, Integer company) {

		String sql = "delete from platform.constructionfunctionright where name = :name and company = :company";
		session().createSQLQuery(sql).setString("name", name).setInteger("company", company).executeUpdate();

		return 0;
	}

}
