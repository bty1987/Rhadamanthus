/**
 * @File Name		: ApprovalDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ProcessItemDao;
import com.fanglin.approval.po.ProcessItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("processItemDao")
public class ProcessItemDaoImpl extends DaoImpl<ProcessItemPO> implements ProcessItemDao {

	public ProcessItemDaoImpl() {
		super(ProcessItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProcessItemPO> queryProcessItem(Long pid) {
		return session().createCriteria(ProcessItemPO.class).add(Restrictions.eq("pid", pid)).addOrder(Order.asc("sort")).list();
	}

	@Override
	public void deleteProcessItem(Long pid) {
		
		String sql = "DELETE FROM approval.processitem WHERE pid = :pid";
		
		session().createSQLQuery(sql).setLong("pid", pid).executeUpdate();
		
	}

}
