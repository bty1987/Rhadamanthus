/**
 * @File Name		: ProtationItemDaoImpl.java
 * @Package   	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.ProtationItemDao;
import com.fanglin.quotation.po.ProtationItemPO;

@Repository("protationItemDao")
public class ProtationItemDaoImpl extends DaoImpl<ProtationItemPO> implements ProtationItemDao {

	public ProtationItemDaoImpl() {
		super(ProtationItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProtationItemPO> queryProtationItem(long pid) {
		return session().createCriteria(ProtationItemPO.class).add(Restrictions.eq("pid", pid)).list();
	}

	@Override
	public int deleteProtationItem(long pid) {

		String sql = "delete from quotation.protationItem where pid = :pid";
		session().createSQLQuery(sql).setLong("pid", pid).executeUpdate();

		return 0;
	}

}
