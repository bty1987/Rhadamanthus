package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.NoticeDepartmentDao;
import com.fanglin.information.po.NoticeDepartmentPO;

@Repository("noticeDepartmentDao")
public class NoticeDepartmentDaoImpl extends DaoImpl<NoticeDepartmentPO> implements NoticeDepartmentDao {
	
	public NoticeDepartmentDaoImpl(){
		super(NoticeDepartmentPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<NoticeDepartmentPO> queryNoticeDepartmentByNid(Long nid) {
		return session().createCriteria(NoticeDepartmentPO.class).add(Restrictions.eq("nid", nid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NoticeDepartmentPO> queryNoticeDepartmentByDid(Integer did) {
		return session().createCriteria(NoticeDepartmentPO.class).add(Restrictions.eq("did", did)).list();
	}

	@Override
	public int deleteNoticeDepartment(Long noticeId) {
		
		String sql="delete from information.noticeDepartment where nid= :nid";
		session().createSQLQuery(sql).setLong("nid", noticeId).executeUpdate();
		
		return 0;
	}
	
}
