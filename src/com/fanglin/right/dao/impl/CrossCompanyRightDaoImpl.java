package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.CrossCompanyRightDao;
import com.fanglin.right.po.CrossCompanyRightPO;

@Repository("crossCompanyRightDao")
public class CrossCompanyRightDaoImpl extends DaoImpl<CrossCompanyRightPO> implements CrossCompanyRightDao {

	public CrossCompanyRightDaoImpl() {
		super(CrossCompanyRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CrossCompanyRightPO> queryCrossCompanyRight(int uid) {
		return session().createCriteria(CrossCompanyRightPO.class).add(Restrictions.eq(CrossCompanyRightPO.COLUMN_UID_STR, uid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public CrossCompanyRightPO queryCrossCompanyRight(String userId, String module) {

		String sql = "select ccr.* from platform.crosscompanyright ccr, communion.user u where ccr.uid = u.uid and u.userId = :userId and ccr.module = :module";

		List<CrossCompanyRightPO> crossCompanyRightPOs = session().createSQLQuery(sql).addEntity(CrossCompanyRightPO.class).setString("userId", userId).setString("module", module).setMaxResults(1).list();

		return crossCompanyRightPOs.size() == 0 ? null : crossCompanyRightPOs.get(0);
	}

	@Override
	public void addCrossCompanyRight(CrossCompanyRightPO crossCompanyRightPO) {
		save(crossCompanyRightPO);
	}

	@Override
	public void deleteCrossCompanyRight(int uid) {
		String sql = "delete from platform.crosscompanyright where uid = :uid";
		session().createSQLQuery(sql).setInteger("uid", uid).executeUpdate();
	}

	@Override
	public void deleteCrossCompanyRight(int uid, String module) {
		String sql = "delete from platform.crosscompanyright where uid = :uid and module = :module";
		session().createSQLQuery(sql).setInteger("uid", uid).setString("module", module).executeUpdate();
	}

}
