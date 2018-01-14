package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.RoleChainPageDao;
import com.fanglin.right.po.RoleChainPagePO;

@Repository("roleChainPageDao")
public class RoleChainPageDaoImpl extends DaoImpl<RoleChainPagePO> implements RoleChainPageDao{
	
	public RoleChainPageDaoImpl(){
		super(RoleChainPagePO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RoleChainPagePO> queryRoleChainPageByRid(int rid) {
		return session().createCriteria(RoleChainPagePO.class).add(Restrictions.eq(RoleChainPagePO.COLUMN_RID_STR, rid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleChainPagePO> queryRoleChainPageByCpid(long cpid) {
		
		return session().createCriteria(RoleChainPagePO.class).add(Restrictions.eq("chainPage.cpid", cpid)).list();
		
	}
	@Override
	public int deleteRoleChainPage(int rid) {
		
		String sql="delete from platform.rolechainpage where rid= :rid";	
		session().createSQLQuery(sql).setInteger("rid", rid).executeUpdate();
		return 0;
	}


}
