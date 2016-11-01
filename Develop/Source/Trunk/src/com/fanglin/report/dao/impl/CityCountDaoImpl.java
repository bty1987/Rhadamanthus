/**
 * @File Name		: CityCountDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.CityCountDao;
import com.fanglin.report.po.CityCountPO;

@Repository("cityCountDao")
public class CityCountDaoImpl extends DaoImpl<CityCountPO> implements CityCountDao {
	
	public CityCountDaoImpl(){
		super(CityCountPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CityCountPO> queryCityCount() {
		return session().createCriteria(CityCountPO.class).list();
	}

}
