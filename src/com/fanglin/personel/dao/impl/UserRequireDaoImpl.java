package com.fanglin.personel.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserRequireDao;
import com.fanglin.personel.po.UserRequirePO;
import com.fanglin.utils.Paging;

@Repository("userRequireDao")
public class UserRequireDaoImpl extends DaoImpl<UserRequirePO> implements UserRequireDao {
	
	public UserRequireDaoImpl(){
		super(UserRequirePO.class); 
	}

	@Override
	public List<UserRequirePO> pageUserRequire(Paging paging, List<Filter> filters) {
		
		PagingQuery<UserRequirePO> query = pagingQuery(paging, UserRequirePO.class);
		
		query.desc("urid");
		
		return query.list();
		
	}
}
