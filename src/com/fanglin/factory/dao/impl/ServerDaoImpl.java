/**
 * @File Name		: ServerDaoImpl.java
 * @Package   	: com.fanglin.system.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-8-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.factory.dao.ServerDao;
import com.fanglin.factory.po.ServerPO;

@Repository("serverDao")
public class ServerDaoImpl extends DaoImpl<ServerPO> implements ServerDao {
	
	public ServerDaoImpl(){
		super(ServerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ServerPO> queryServerByCompany(int company) {
		return session().createCriteria(ServerPO.class).add(Restrictions.eq(ServerPO.COLUMN_COMPANY_STR, company)).list();
	}
	
}
