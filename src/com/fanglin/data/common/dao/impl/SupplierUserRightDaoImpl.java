/**
 * @File Name		: SupplierUserRightDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.SupplierUserRightDao;
import com.fanglin.data.po.SupplierUserRightPO;

@Repository("supplierUserRightDao")
public class SupplierUserRightDaoImpl extends DaoImpl<SupplierUserRightPO> implements SupplierUserRightDao {
	
	public SupplierUserRightDaoImpl(){
		super(SupplierUserRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierUserRightPO> querySupplierUserRightBySId(long sId) {
		return session().createCriteria(SupplierUserRightPO.class).add(Restrictions.eq(SupplierUserRightPO.COLUMN_SID_STR, sId)).list();
	}

	@Override
	public int deleteSupplierUserRightBySId(long sId) {
		
		String sql = "delete from communion.supplieruserright where sid in :sid";
		session().createSQLQuery(sql).setLong("sid", sId).executeUpdate();
		
		return 0;
	}

}
