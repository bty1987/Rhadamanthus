/**
 * @File Name		: WorkTypeDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.WorkTypeDao;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("worktype")
public class WorkTypeDaoImpl extends DaoImpl<WorkTypePO> implements WorkTypeDao {

	public WorkTypeDaoImpl() {
		super(WorkTypePO.class, true);
	}

}
