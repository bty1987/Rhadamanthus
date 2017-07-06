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
	@SuppressWarnings("unchecked")
	@Override
	public List<NoticeDepartmentPO> queryNoticeDepartmentByNoticeId(int noticeId) {

		return session().createCriteria(NoticeDepartmentPO.class).add(Restrictions.eq(NoticeDepartmentPO.NOTICE,noticeId)).list();
	}
	public void deleteNoticeDepartments(Integer noticeId) {
		String sql="delete from platform.noticesDepartment where nid="+noticeId;
		session().createSQLQuery(sql).executeUpdate();
		
	}
	// 
	
	@SuppressWarnings("unchecked")
	@Override
	public List<NoticeDepartmentPO> queryDepartmentIdNoticeId(int did) {
		return session().createCriteria(NoticeDepartmentPO.class).add(Restrictions.eq("did", did)).list();
	}
	
}
