/**
 * @File Name		: CityProperCountDaoImpl.java
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
import com.fanglin.report.dao.CityProperCountDao;
import com.fanglin.report.po.CityProperCountPO;

@Repository("cityProperCountDao")
public class CityProperCountDaoImpl extends DaoImpl<CityProperCountPO> implements CityProperCountDao {
	
	public CityProperCountDaoImpl(){
		super(CityProperCountPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CityProperCountPO> queryCityProperCount() {
		return session().createCriteria(CityProperCountPO.class).list();
	}

}
