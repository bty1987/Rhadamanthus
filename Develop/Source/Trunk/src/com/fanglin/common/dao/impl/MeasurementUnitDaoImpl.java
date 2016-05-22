/**
 * @File Name		: MeasurementUnitDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.MeasurementUnitDao;
import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("measurementunit")
public class MeasurementUnitDaoImpl extends DaoImpl<MeasurementUnitPO> implements 	MeasurementUnitDao {

	public MeasurementUnitDaoImpl(){
		super(MeasurementUnitPO.class, true);
	}

}
