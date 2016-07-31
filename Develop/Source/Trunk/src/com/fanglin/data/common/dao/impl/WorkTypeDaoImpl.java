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

package com.fanglin.data.common.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.WorkTypeDao;
import com.fanglin.data.po.WorkTypePO;

@Repository("worktype")
public class WorkTypeDaoImpl extends DaoImpl<WorkTypePO> implements WorkTypeDao {

	public WorkTypeDaoImpl(){
		super(WorkTypePO.class, true);
	}

}
