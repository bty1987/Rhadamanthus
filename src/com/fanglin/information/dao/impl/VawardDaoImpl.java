/**
 * @File Name		: VawardDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.VawardDao;
import com.fanglin.information.po.VawardPO;

@Repository("vawardDao")
public class VawardDaoImpl extends DaoImpl<VawardPO> implements VawardDao {

	public VawardDaoImpl() {
		super(VawardPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VawardPO> queryVawardByNo(String no) {
		return session().createCriteria(VawardPO.class).add(Restrictions.eq("no", no)).list();
	}

	@Override
	public List<?> countVaward() {

		String sql = "SELECT name, sum(num) FROM information.vaward WHERE status = 0 GROUP BY name";

		return session().createSQLQuery(sql).list();
	}

}
