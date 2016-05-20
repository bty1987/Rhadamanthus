/**
 * @File Name		: DecorationOrderDesignDepartmentRightDao.java
 * @Package   	: com.fanglin.right.dao
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.DecorationOrderDesignDepartmentRightPO;

public interface DecorationOrderDesignDepartmentRightDao extends Dao<DecorationOrderDesignDepartmentRightPO> {
	
	public List<DecorationOrderDesignDepartmentRightPO> queryDecorationOrderDesignDepartmentRightByUId(int uId);
	
	public int deleteDecorationOrderDesignDepartmentRightByUId(int uId);

}
