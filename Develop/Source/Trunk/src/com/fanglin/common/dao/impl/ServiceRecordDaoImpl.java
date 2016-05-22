/**
 * @File Name		: ServiceRecordDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-3-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("serviceRecordDao")
public class ServiceRecordDaoImpl extends DaoImpl<ServiceRecordPO> implements ServiceRecordDao {
	
	public ServiceRecordDaoImpl(){
		super(ServiceRecordPO.class);
	}

}
